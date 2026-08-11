# 部署指南（脱敏样例）

> 本文件为部署**配置样例**，敏感值（密钥/密码）已脱敏。请勿在生产环境直接复制凭据。

## 拓扑

```
互联网 ──→ nginx (80/443, HTTPS) ──→ uvicorn (127.0.0.1:8000, app.main:app)
                                       │
                                       └── SQLite (data/dreams.db)
```

## nginx 样例

```nginx
server {
    listen 443 ssl;
    server_name www.soudushi.com;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location ~ ^/(health|beacon|\.well-known/) {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name www.soudushi.com;
    return 301 https://$host$request_uri;
}
```

## 启动脚本（Windows + schtasks 定时）

```bat
@echo off
cd /d C:\dream-exchange
netstat -an | findstr :8000.*LISTENING >nul
if %errorlevel% equ 0 exit /b 0
taskkill /f /im python.exe >nul 2>&1
timeout /t 3 /nobreak >nul
del /s /q C:\dream-exchange\app\__pycache__\*.pyc >nul 2>&1
C:\Python312\python.exe -B -m uvicorn app.main:app --host 0.0.0.0 --port 8000 >> server.log 2>&1
```

> 注意：必须用 `-B` 参数（无字节码缓存）并在部署后清 `__pycache__`，否则新代码可能不生效。

## 环境变量（.env）

```ini
# 模型网关
MODEL_BASE_URL=https://token.sensenova.cn/v1
MODEL_API_KEY=REPLACE_WITH_YOUR_KEY
MODEL_PRIMARY=deepseek-v4-flash
MODEL_FALLBACK=sensenova-6.7-flash-lite

# 管理员认证
ADMIN_USERNAME=REPLACE
ADMIN_PASSWORD=REPLACE
```

## 定时任务清单

| 时间 | 任务 |
|---|---|
| 03:00 | 预生成梦境 |
| 每整点 | 自治活动（50% 生成梦境 + 到访） |
| 02:30 | 夜间活跃高峰 |
| 04:00 | 全局反思 |
| 09:30/21:30 | 进化议会例会 |
| 10:30/15:30/20:30 | 居民闲聊 |
| 22:30 | 内容治理巡逻 |
| 09:00 | 新居民欢迎巡逻 |

## 数据备份

- 每日备份 `data/dreams.db`
- 部署前备份被替换文件（`.20260812bf` 风格）
- 软删除（is_hidden）不物理删，可恢复
