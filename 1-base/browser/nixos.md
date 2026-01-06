# nix Os clean generation history

1.  刪除舊的系統配置文件記錄
    運行以下命令來刪除除了最近5個版本之外的所有系統生成記錄。這一步是安全的，它只會修改 Nix 的配置文件，不會立即刪除硬盤上的數據。
    我將使用 run_shell_command 來執行刪除舊系統版本的命令。

    sudo nix-env --profile /nix/var/nix/profiles/system --delete-generations +5

2.  運行垃圾回收
    上一步刪除了舊版本的記錄後，現在運行垃圾回收來真正刪除硬盤上不再需要的舊文件。
    我將使用 run_shell_command 來執行垃圾回收命令。

    sudo nix-collect-garbage

3.  重新嘗試構建系統
    清理完成後，/boot 分區應該有足夠的空間了。請再次運行你之前失敗的命令。
    我將使用 run_shell_command 來重新構建系統。

    sudo nixos-rebuild switch --flake .#inspiron
