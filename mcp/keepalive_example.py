# -*- coding: utf-8 -*-
"""MCP keepalive：检查 8765 是否在听，不在则 schtasks /run DreamExchangeMcp（长任务本体）。
计划任务 DreamExchangeMcpKeep（SYSTEM，每5分钟）跑本脚本。
教训：SSH 会话 spawn 的长进程会随会话关闭被回收，必须走 Task Scheduler 拉起。"""
import socket
import subprocess
import datetime
import time

PORT = 8765
LOG = r"C:\dream-exchange\mcp_keepalive.log"


def listening(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(3)
        return s.connect_ex(("127.0.0.1", port)) == 0


def log(msg):
    try:
        with open(LOG, "a", encoding="utf-8") as f:
            f.write("[%s] %s\n" % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), msg))
    except Exception:
        pass


def main():
    if listening(PORT):
        return  # healthy, silent
    log("port %d down -> schtasks /run DreamExchangeMcp" % PORT)
    try:
        subprocess.run(["schtasks", "/run", "/tn", "DreamExchangeMcp"],
                       capture_output=True, timeout=30)
    except Exception as e:
        log("schtasks run failed: %s" % e)
        return
    for _ in range(10):
        time.sleep(1)
        if listening(PORT):
            log("mcp_server up via task")
            return
    log("WARN: still not listening after 10s — check task state / mcp_server.err.log")


if __name__ == "__main__":
    main()
