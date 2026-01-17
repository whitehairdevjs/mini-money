# Docker 사용 가이드

이 문서는 mini-money 프로젝트의 Docker 이미지 빌드 및 실행 방법을 설명합니다.

## 📋 목차

1. [개별 이미지 빌드 및 실행](#개별-이미지-빌드-및-실행)
2. [Docker Compose를 사용한 전체 스택 실행](#docker-compose를-사용한-전체-스택-실행)
3. [환경 변수 설정](#환경-변수-설정)
4. [문제 해결](#문제-해결)

---

## 개별 이미지 빌드 및 실행

### Backend 이미지 빌드 및 실행

#### 1. 이미지 빌드

```bash
cd backend
docker build -t mini-money-backend:latest .
```

#### 2. 컨테이너 실행

```bash
docker run -d \
  --name mini-money-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/minimoney \
  -e SPRING_DATASOURCE_USERNAME=minimoney \
  -e SPRING_DATASOURCE_PASSWORD=minimoney123 \
  mini-money-backend:latest
```

#### 3. 로그 확인

```bash
docker logs -f mini-money-backend
```

#### 4. 컨테이너 중지 및 제거

```bash
docker stop mini-money-backend
docker rm mini-money-backend
```

---

### Frontend 이미지 빌드 및 실행

#### 1. 이미지 빌드

```bash
cd frontend/web
docker build -t mini-money-frontend:latest .
```

#### 2. 컨테이너 실행

```bash
docker run -d \
  --name mini-money-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8080/api \
  mini-money-frontend:latest
```

#### 3. 로그 확인

```bash
docker logs -f mini-money-frontend
```

#### 4. 컨테이너 중지 및 제거

```bash
docker stop mini-money-frontend
docker rm mini-money-frontend
```

---

## Docker Compose를 사용한 전체 스택 실행

Docker Compose를 사용하면 Backend, Frontend, Database를 한 번에 실행할 수 있습니다.

### 1. 전체 스택 실행

프로젝트 루트 디렉토리에서 실행:

```bash
docker-compose up -d
```

또는 빌드와 함께 실행:

```bash
docker-compose up -d --build
```

### 2. 로그 확인

전체 로그:
```bash
docker-compose logs -f
```

특정 서비스 로그:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### 3. 서비스 상태 확인

```bash
docker-compose ps
```

### 4. 전체 스택 중지

```bash
docker-compose down
```

데이터베이스 볼륨까지 제거하려면:
```bash
docker-compose down -v
```

### 5. 서비스 재시작

```bash
docker-compose restart backend
docker-compose restart frontend
```

---

## 환경 변수 설정

### Backend 환경 변수

`.env` 파일을 생성하거나 환경 변수를 직접 설정할 수 있습니다:

```bash
# application-prod.yml 또는 환경 변수로 설정
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/minimoney
SPRING_DATASOURCE_USERNAME=minimoney
SPRING_DATASOURCE_PASSWORD=minimoney123
JWT_SECRET=your-256-bit-secret-key-for-jwt-token-generation-minimum-32-characters
JWT_EXPIRATION=86400000
```

### Frontend 환경 변수

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Docker Compose에서 환경 변수 사용

`docker-compose.yml` 파일을 수정하거나 `.env` 파일을 프로젝트 루트에 생성:

```env
# .env 파일
POSTGRES_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key
```

---

## 문제 해결

### 1. 포트 충돌

이미 사용 중인 포트가 있는 경우:

```bash
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :8080
lsof -i :3000
```

포트를 변경하려면 `docker-compose.yml`의 `ports` 섹션을 수정하세요.

### 2. 이미지 빌드 실패

캐시 없이 다시 빌드:

```bash
docker build --no-cache -t mini-money-backend:latest ./backend
docker build --no-cache -t mini-money-frontend:latest ./frontend/web
```

### 3. 컨테이너가 시작되지 않음

로그 확인:

```bash
docker-compose logs backend
docker-compose logs frontend
```

### 4. 데이터베이스 연결 오류

- 데이터베이스 컨테이너가 실행 중인지 확인:
  ```bash
  docker-compose ps db
  ```

- 데이터베이스 연결 정보 확인:
  ```bash
  docker-compose exec db psql -U minimoney -d minimoney
  ```

### 5. Frontend에서 Backend API 연결 실패

`next.config.js`의 `rewrites` 설정을 확인하거나, 환경 변수 `NEXT_PUBLIC_API_URL`을 올바르게 설정했는지 확인하세요.

프로덕션 환경에서는:
```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://backend:8080/api/:path*', // Docker 내부 네트워크 사용
    },
  ];
}
```

---

## 추가 팁

### 이미지 크기 최적화

- Multi-stage 빌드를 사용하여 최종 이미지 크기를 줄였습니다.
- 불필요한 파일은 `.dockerignore`에 추가했습니다.

### 개발 환경에서 사용

개발 중에는 Docker를 사용하지 않고 로컬에서 실행하는 것이 더 편리할 수 있습니다:

```bash
# Backend
cd backend
./gradlew bootRun

# Frontend
cd frontend/web
npm run dev
```

### 프로덕션 배포

프로덕션 환경에서는:
1. 환경 변수를 안전하게 관리하세요.
2. HTTPS를 설정하세요.
3. 데이터베이스 백업을 정기적으로 수행하세요.
4. 로그 모니터링을 설정하세요.

---

## 빠른 참조

```bash
# 전체 스택 시작
docker-compose up -d --build

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down

# 특정 서비스만 재시작
docker-compose restart backend

# 이미지 제거
docker-compose down --rmi all

# 볼륨까지 제거
docker-compose down -v
```

