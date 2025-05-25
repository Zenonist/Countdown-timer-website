variable "TAG" {
    default = "latest"
}

group "default" {
    targets = ["countdown-timer-website-backend", "countdown-timer-website-frontend"]
}

target "countdown-timer-website-backend" {
    context = "./Backend"
    dockerfile = "./Dockerfile"
    platforms = ["linux/amd64", "linux/arm64"]
    tags = ["zenonist/countdown-timer-website-backend:${TAG}"]
}

target "countdown-timer-website-frontend" {
    context = "./Frontend"
    dockerfile = "./Dockerfile"
    platforms = ["linux/amd64", "linux/arm64"]
    tags = ["zenonist/countdown-timer-website-frontend:${TAG}"]
}