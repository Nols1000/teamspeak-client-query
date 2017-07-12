pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        parallel(
          "Test": {
            sleep 10
            echo 'Test Done'
            
          },
          "": {
            sleep 5
            
          }
        )
      }
    }
    stage('End') {
      steps {
        echo 'End'
      }
    }
  }
}