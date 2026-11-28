# 看门狗模板

hook 每轮都会 touch 心跳文件，`ilink.py watchdog` 是判断 hook 死活的死信开关。默认心跳超过 30 分钟算过期。

## 检查命令

```bash
ILINK_DATA_DIR=<你的数据目录> <桥仓库>/.venv/bin/python <桥仓库>/ilink.py watchdog
```

再读心跳文件的时间，确认心跳是否新鲜：

```bash
ls -l <HOOK_STATE_DIR>/ilink-heartbeat
```

## cron 建议

- 每 5 分钟检查一次。
- 心跳新鲜时不要发消息，保持安静。
- 只有第一次发现心跳过期，或过期后恢复时，才发一条消息，说明时间、发生了什么、现在的状态。
- 不要重复发相同的告警，不要编造状态，所有结论以命令输出为准。
- 如果桥是用户主动停掉的（`<HOOK_STATE_DIR>/ilink-watchdog-off` 标记存在），保持安静，不要告警。

## 常见误判

- 桥空闲但心跳新鲜是健康的，别因为“没消息”就报故障。
- 桥静默且心跳过期才是 hook 死了，先查心跳再下结论。
- 看门狗只覆盖轮询心跳，不覆盖发送路径。推送断了要去查 `send_audit.jsonl`，见 `troubleshooting.md`。
