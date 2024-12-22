## Development
```bash
docker compose up
```

## Production
### login
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin https://{ecr-id}.dkr.ecr.{region}.amazonaws.com
```

### push
```bash
docker compose --env-file .env.production -f docker-compose.yml build
docker compose --env-file .env.production -f docker-compose.yml push
```