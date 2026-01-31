```
# 1. 确保内核转发依然开启 sudo sysctl -w net.ipv4.ip_forward=1 # 2. 恢复通用的虚拟机出网伪装规则 # 只要是从 virbr0 出来的流量，想去外网的，都允许伪装 sudo iptables -t nat -A POSTROUTING -s 192.168.122.0/24 ! -d 192.168.122.0/24 -j MASQUERADE # 3. 确保 FORWARD 链允许虚拟机发出的包出去 sudo iptables -I FORWARD 1 -s 192.168.122.0/24 -i virbr0 -j ACCEPT sudo iptables -I FORWARD 1 -d 192.168.122.0/24 -o virbr0 -m state --state RELATED,ESTABLISHED -j ACCEPT
```

```
# 变量定义
export VM_IP="192.168.122.237"
export VM_NET="192.168.122.0/24"
export HOST_BRIDGE="br0"
export GUEST_BRIDGE="virbr0"
export PORT="5173"

# 1. 开启转发
sudo sysctl -w net.ipv4.ip_forward=1

# 2. 入站 DNAT: 只处理从 br0 进来的 5173 端口流量
sudo iptables -t nat -A PREROUTING -i $HOST_BRIDGE -p tcp --dport $PORT -j DNAT --to-destination $VM_IP:$PORT

# 3. 转发放行: 明确允许 br0 到 virbr0 之间的 5173 流量
sudo iptables -A FORWARD -i $HOST_BRIDGE -o $GUEST_BRIDGE -p tcp -d $VM_IP --dport $PORT -j ACCEPT

# 4. 精准伪装: 只对通过 virbr0 发往虚拟机的流量做 MASQUERADE，且排除虚拟机自身
# 这是保护 Clash 不断网的关键
sudo iptables -t nat -A POSTROUTING -o $GUEST_BRIDGE -p tcp -d $VM_IP --dport $PORT ! -s $VM_NET -j MASQUERADE

# 5. 防火墙放行
sudo iptables -I INPUT 1 -p tcp --dport $PORT -j ACCEPT
```

```
sudo socat TCP4-LISTEN:5173,fork,reuseaddr TCP4:192.168.122.237:5173 &
sudo iptables -I INPUT 1 -p tcp --dport 5173 -j ACCEPT
```