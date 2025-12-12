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
                    sh """
                        # 1. Prepare Remote Directory
                        ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} 'mkdir -p ${REMOTE_DIR}'
                        
                        # 2. Transfer Files
                        # Transferring the whole workspace excluding heavy/unnecessary folders
                        # This covers backend, frontend, and docker-compose.yml
                        tar --exclude='node_modules' --exclude='.git' --exclude='.next' --exclude='dist' -czf - . | ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} "tar -xzf - -C ${REMOTE_DIR}"
                        
                        # 3. Deploy using Docker Compose
                        ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} 'bash -s' << 'ENDSSH'
                            cd ${REMOTE_DIR}
                            
                            # Check for .env (User handles this manually via script, but good to warn)
                            if [ ! -f .env ]; then
                                echo "WARNING: .env file missing! Ensure you have deployed secrets."
                            fi
                            
                            # Determine correct docker compose command
                            if docker compose version >/dev/null 2>&1; then
                                CMD="docker compose"
                            else
                                CMD="docker-compose"
                            fi
                            echo "Using: \$CMD"

                            # Stop and remove old containers/orphans
                            \$CMD down --remove-orphans || true
                            
                            # Build and start
                            \$CMD up -d --build
                            
                            # Cleanup
                            docker image prune -f
ENDSSH
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'deploy-key-pem', keyFileVariable: 'SSH_KEY')]) {
                    sh """
                        ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} '
                            echo "Waiting for containers to start..."
                            sleep 20
                            
                            if [ \$(docker ps -q | wc -l) -gt 0 ]; then
                                echo "Containers are running!"
                                docker ps
                            else
                                echo "No containers running!"
                                docker ps -a
                                # Check logs of new container names
                                docker logs VisiteHub-backend-new || true
                                exit 1
                            fi
                        '
                    """
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
