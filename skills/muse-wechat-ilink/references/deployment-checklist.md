# 部署检查清单

按顺序打勾，每一步的回执含义见 `SKILL.md` 和上游 `AGENTS.md`。

## 准备

- [ ] Python 3.10+ 可用
- [ ] 已克隆上游仓库 `https://github.com/gfydfhcf/wechat-ilink-muse-bridge`
- [ ] 已在仓库里执行 `pip install -r requirements.txt`
- [ ] 已选定数据目录（在仓库之外），并对每条命令都导出 `ILINK_DATA_DIR=<dir>`
- [ ] `python3 ilink.py preflight` 全部通过

## 登录

- [ ] `python3 ilink.py qrcode` 生成二维码图片
- [ ] 已把二维码发给用户，用户已扫码并在微信里确认
- [ ] `python3 ilink.py login <qrcode-id>` 成功
- [ ] 数据目录里已生成 `session.json`
- [ ] 二维码过期时已重新生成新鲜的，旧码已作废

## 绑定主人

- [ ] 登录后、启动任何驱动之前，执行 `python3 ilink.py bind`
- [ ] 已在主聊天告诉用户：10 分钟内给机器人发任意一条微信消息
- [ ] 收到 `BIND_OK:<id>`
- [ ] `owner.json` 已写入 `owner_id` 和 `owner_ids`
- [ ] 机器人已向主人发送欢迎消息

超时处理：`BIND_TIMEOUT` 时提醒用户并重开绑定窗口，直到成功或用户叫停。

## 接 hook 驱动（Muse 内）

- [ ] 已读上游 `examples/muse-hook/README.md`
- [ ] 已写 wrapper 脚本，导出 `ILINK_DATA_DIR`、`ILINK_CLIENT`、`ILINK_HOOK_STATE_DIR`
- [ ] hook 定义已按 `references/hook-definition.json` 模板填写真实路径和投递聊天
- [ ] hook 已启用，轮询间隔约 5 秒
- [ ] 已确认没有同时在跑 `daemon.py`（共享驱动锁 `ilink-driver.lock`）

## 验证

- [ ] 用户发一条微信，机器人收到并只回一条
- [ ] 回复期间微信显示“正在输入”
- [ ] `python3 ilink.py proactive <user_id> -` 主动推送成功
- [ ] `python3 ilink.py health` 返回 0
- [ ] `python3 ilink.py smoke-test` 返回 0（或只有 SKIP，无失败项）

## 看门狗与日常

- [ ] 看门狗 cron 已建，每 5 分钟跑 `ilink.py watchdog`
- [ ] 心跳文件 `ilink-heartbeat` 每轮都在刷新
- [ ] 已确认看门狗规则：心跳新鲜时静默，只报第一次过期和恢复
- [ ] 已告诉用户：`TOKEN_EXPIRED` 要重扫，`TOKEN_STALE` 等一会儿就行
- [ ] 已告诉用户：主动推送断了时，在微信上随便发一句就能刷新 token
