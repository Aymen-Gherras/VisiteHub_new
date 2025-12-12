pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_CMD = 'docker compose'
        VPS_USER = 'root'
        VPS_IP = '213.199.58.144'
        PROJECT_DIR = '/root/VisiteHub_New'
    }

    stages {
        stage('Prepare VPS') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} 'mkdir -p ${PROJECT_DIR}'"
                }
            }
        }

        stage('Transfer Files') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    // Transfer backend
                    sh "scp -i ${SSH_KEY} -o StrictHostKeyChecking=no -r visiteapihub.duckdns.org ${VPS_USER}@${VPS_IP}:${PROJECT_DIR}/"
                    
                    // Transfer frontend
                    sh "scp -i ${SSH_KEY} -o StrictHostKeyChecking=no -r visitehub.duckdns.org ${VPS_USER}@${VPS_IP}:${PROJECT_DIR}/"
                    
                    // Transfer docker-compose
                    sh "scp -i ${SSH_KEY} -o StrictHostKeyChecking=no docker-compose.yml ${VPS_USER}@${VPS_IP}:${PROJECT_DIR}/"
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh """
                        ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} '
                            cd ${PROJECT_DIR}
                            
                            # Stop old containers if running (optional, based on new names)
                            ${DOCKER_COMPOSE_CMD} down || true
                            
                            # Build and start new containers
                            ${DOCKER_COMPOSE_CMD} up -d --build
                            
                            # Prune unused images to save space
                            docker image prune -f
                        '
                    """
                }
            }
        }
    }
}
