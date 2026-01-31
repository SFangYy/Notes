完成了！我已经将 nh 配置移到了 home-manager 中 (home/default.nix:86-91)，配置会在 ~/.config 下管理。                                        

- nh 配置说明                                                     
```    
```
         
  我配置了以下选项：                                                 
  - clean.enable = true - 启用自动清理                             
  - clean.extraArgs = "--keep-since 7d --keep 5" - 保留最近 7 天的构建和最新的 5 个版本                                              
  - flake = "~/nixos" - 指定你的 flake 目录                                                                                                   
                                                                                                                                              
  nh 常用命令                                                      系统重构                                                         # 重构系统配置（替代 sudo nixos-rebuild switch）                                                                                    
  ```
  sudo nh os switch                                               
  # 重构系统并显示 详细输出                                                                                                                    
  sudo nh os switch --verbose                                                                                                     
  # 测试配置但不切换（替代 nixos-rebuild test）                                                                                               
  sudo nh os test                                                                                                                             
                                                                                                                                              
  # 只构建不激活（替代 nixos-rebuild build）                                                                                                  
  sudo nh os build                                                                                                                                                                                                 
  Home-Manager 重构                                                                                                             
  # 重构 home-manager 配置（替代 home-manager switch）                                                                                        
  nh home switch                                                                                                                       
  # 重构特定主机的 home-manager                                                                                                               
  nh home switch -- --flake ~/nixos#sfangyy@你的主机名                                                                                   
  清理                                                                                                                                        
                                                                                                                                              
  # 清理旧的系统版本                                                                                                                          
  sudo nh clean all                                                                                                                           
                                                                                                                                              
  # 查看清理计划（不实际删除）                                                                                                                
  sudo nh clean all --dry-run                                                                                                                 
                                                                                                                                              
  搜索包                                                                                                                                                                                                                
  # 搜索包                                                                                                                                    
  nh search firefox                                               
                                                                                                                                        
  nh 的优势                                                                                                                                     
  相比传统的 nixos-rebuild 和 home-manager 命令，nh 提供：              
  - 更好的彩色输出和进度显示                                         
  - 自动处理 flake 路径                                            
  - 更简洁的命令语法                                               
  - 内置的清理功能                                                                                                                                                                                                                                      
  现在你可以运行 nh home switch 来应用这个配置变化。 
  ```
  