nmap H ^
nmap L $
nmap J 6qj 
nmap K 6gk
imap jk <Esc>

set clipboard=unnamed

" Surround text with [[ ]] to make a wikilink

" NOTE: must use 'map' and not 'nmap'

exmap wiki surround [[ ]]

map <A-m> :wiki 


unmap <Space>

" 将 <Space>e 映射到打开/关闭左侧边栏的 Obsidian 命令
" Obsidian 的命令是 'app:toggle-left-sidebar'
" 你可以使用 :obcommand 或 :obsidian 命令来执行 Obsidian 内部命令
exmap ntree obcommand app:toggle-left-sidebar 
map <Space>e: ntree
