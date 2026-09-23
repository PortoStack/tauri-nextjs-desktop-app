# ==========================================
# Stage 1: Build Next.js & Tauri Binary
# ==========================================
FROM rust:bookworm AS builder

ENV DEBIAN_FRONTEND=noninteractive

# ติดตั้ง Node.js (v20) และแพ็กเกจที่ต้องใช้ build Tauri
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update -o Acquire::Check-Valid-Until=false && \
    apt-get install -y --no-install-recommends \
    nodejs \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src-tauri/Cargo.* ./src-tauri/
COPY . .

RUN npx tauri build

# ==========================================
# Stage 2: Runtime สำหรับรันขึ้นจอจริง
# ==========================================
FROM debian:bookworm-slim AS runner

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -o Acquire::Check-Valid-Until=false && \
    apt-get install -y --no-install-recommends \
    libwebkit2gtk-4.1-0 \
    libgtk-3-0 \
    libayatana-appindicator3-1 \
    librsvg2-common \
    libgl1-mesa-dri \
    libgl1-mesa-glx \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# คัดลอก Binary ตัวสำเร็จ (ตรวจดูให้แน่ใจว่าชื่อไฟล์ตรงกับ package name ใน src-tauri/Cargo.toml)
COPY --from=builder /app/src-tauri/target/release/medbot-gui /app/medbot-gui
RUN chmod +x /app/medbot-gui

CMD ["/app/medbot-gui"]