pipeline {
    agent any

    environment {
        SERVER_IP = '213.199.58.144'
        SSH_USER = 'root'
        REMOTE_DIR = '/root/VisiteHub_New'
    }

    stages {
        stage('Deploy to Server') {
            steps {
                // Using the credential ID from the old file: 'deploy-key-pem'
                withCredentials([sshUserPrivateKey(credentialsId: 'deploy-key-pem', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        # 1. Prepare Remote Directory
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SSH_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"
                        
                        # 2. Transfer Files
                        # Transferring the whole workspace excluding heavy/unnecessary folders
                        # This covers backend, frontend, and docker-compose.yml
                        # IMPORTANT: never overwrite server secrets (.env) from Jenkins workspace
                        tar --exclude='node_modules' --exclude='.git' --exclude='.next' --exclude='dist' --exclude='.env' --exclude='.env.*' -czf - . | ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SSH_USER@$SERVER_IP "tar -xzf - -C $REMOTE_DIR"
                        
                        # 3. Deploy using Docker Compose
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SSH_USER@$SERVER_IP "REMOTE_DIR='$REMOTE_DIR' bash -s" << 'ENDSSH'
                            cd "$REMOTE_DIR"
                            set -euo pipefail
                            
                            # Check for .env (fail fast: backend requires DB_* and we want NODE_ENV=production on VPS)
                            if [ ! -f .env ]; then
                                echo "ERROR: .env file missing in $REMOTE_DIR. Deploy secrets before running Jenkins deploy."
                                exit 1
                            fi

                            if ! grep -qE '^NODE_ENV=production$' .env; then
                                echo "ERROR: NODE_ENV=production is missing from .env (current backend defaults to development if unset)."
                                echo "Fix: add NODE_ENV=production to $REMOTE_DIR/.env"
                                exit 1
                            fi

                            # Minimal DB env sanity check (prevents confusing boot failures)
                            for key in DB_USERNAME DB_PASSWORD DB_DATABASE; do
                                if ! grep -qE "^${key}=" .env; then
                                    echo "ERROR: ${key} is missing from .env"
                                    exit 1
                                fi
                            done
                            
                            # Determine correct docker compose command
                            if docker compose version >/dev/null 2>&1; then
                                CMD="docker compose"
                            else
                                CMD="docker-compose"
                            fi
                            echo "Using: $CMD"

                            # Stop and remove old containers/orphans
                            $CMD down --remove-orphans || true
                            
                            # Build and start
                            $CMD up -d --build
                            
                            # Cleanup
                            docker image prune -f
ENDSSH
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'deploy-key-pem', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SSH_USER@$SERVER_IP '
                            echo "Waiting for containers to start..."
                            sleep 20

                            expected_containers="VisiteHub-backend-new VisiteHub-frontend-new VisiteHub-db-new VisiteHub-redis-new"
                            failed=0
                            for c in \$expected_containers; do
                                if ! docker inspect \$c >/dev/null 2>&1; then
                                    echo "ERROR: container \$c not found"
                                    failed=1
                                    continue
                                fi

                                running=$(docker inspect -f "{{.State.Running}}" $c)
                                status=$(docker inspect -f "{{.State.Status}}" $c)
                                exitCode=$(docker inspect -f "{{.State.ExitCode}}" $c)
                                restarting=$(docker inspect -f "{{.State.Restarting}}" $c)

                                echo "$c => running=$running status=$status exitCode=$exitCode restarting=$restarting"
                                if [ "$running" != "true" ] || [ "$restarting" = "true" ] || [ "$exitCode" != "0" ]; then
                                    failed=1
                                fi
                            done

                            if [ $failed -ne 0 ]; then
                                echo "ERROR: One or more containers unhealthy. Showing docker ps and backend logs..."
                                docker ps -a
                                docker logs VisiteHub-backend-new || true
                                exit 1
                            fi

                            echo "All expected containers are running."
                            docker ps
                        '
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
