#provider "docker" {} => baic /var/run/docker.sock but i use orb 

provider "docker" {
  host = "unix:///Users/pongphisut/.orbstack/run/docker.sock"
}

resource "docker_image" "nginx" {
  name         = "docker.mirror.hashicorp.services/nginx:latest"
  keep_locally = false
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "tutorial"
  ports {
    internal = 80
    external = 8000
  }

}