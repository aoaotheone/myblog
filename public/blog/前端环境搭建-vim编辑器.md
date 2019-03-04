# 前端环境搭建——vim编辑器
网上有很多程序员都十分推崇vim编辑器，而我因为经常在服务器上编辑代码，想着好好学习一下vim的使用，所以今天就一步一步的将vim改装成前端开发利器。
## vim配置文件.vimrc

```
cd ~
vim .vimrc
```
上述步骤是进入用户目录`~`，在终端运行某些命令时，系统会先检查该目录下有没有该命令的相关配置，有则按配置执行。`.vimrc`是vim的配置文件，如果该目录下没有这个文件，就直接新建。
#### 简单配置
```
"显示行号
set nu

"语法高亮
syntax on

"不需要备份
set nobackup

"没有保存或文件只读时弹出确认
set confirm

"鼠标可用
set mouse=a

"tab缩进
set tabstop=4
set shiftwidth=4
set expandtab
set smarttab

"文件自动检测外部更改
set autoread


"自动对齐
set autoindent

"智能缩进
set smartindent

"高亮查找匹配
set hlsearch

"显示匹配
set showmatch

"显示标尺，就是在右下角显示光标位置
set ruler

"不要闪烁
set novisualbell

"浅色显示当前行
autocmd InsertLeave * se nocul

"用浅色高亮当前行
autocmd InsertEnter * se cul

" vundle 环境设置
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
" vundle 管理的插件列表必须位于 vundle#begin() 和 vundle#end() 之间
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'
" 插件列表结束
call vundle#end()
filetype plugin indent on

" 配色方案
set background=dark
"colorscheme solarized
"colorscheme molokai
"colorscheme phd

"编码设置
set encoding=utf-8
```
vim配置文件中，双引号`"`为注释符号。上述配置中，`vundle`和配色方案需要额外配置，下面会进行说明
## vundle管理vim插件
vundle是用来管理vim插件的，方便我们安装，卸载，搜索，查看插件。
#### 安装vundle
```
git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
```
#### 通过vundle安装插件
vundle在安装插件之前，需要在`.vimrc`中的`vundle#begin()`和 `vundle#end()`之间添加一行

插件在GitHub上搜索关键字

```
Plugin 'github用户名/插件名'
```
然后执行以下命令，将会安装`.vimrc`中列出的插件

```
vim
:PluginInstall
```
需要卸载插件时，只要将`.vimrc`中的`Plugin 'github用户名/插件名'`注释掉，然后

```
vim
:PluginClean
```
需要更新插件时

```
vim
:PlugUpdate
```
## 配色方案
推荐配色下载网站：http://bytefluent.com/vivify/

在该网站上挑好喜欢的配色方案，下载到本地后，将文件类型改为`.vim`，如`blackdust.vim`。然后将文件移动到`~/.vim/colors`目录下。

```
cp Download/blackdust.vim ~/.vim/colors
```
并在`.vimrc`中添加

```
colorscheme blackdust
```
这样就可以改变vim的配色方案了
## 代码补全
vim有一个非常有名的代码补全插件，叫youcompleteme。
#### 安装
在`.vimrc`中的`vundle#begin()`和 `vundle#end()`之间添加

```
Plugin 'Valloric/YouCompleteMe'
```
运行命令

```
vim
:PluginInstall
```
由于YouCompleteMe这个插件比较大，所以要下载的时间十分的漫长，非常非常的漫长

下载完成后,进入YouCompleteMe目录下，检查是否下载完整

```
cd ./vim/bundle/YouCompleteMe
git submodule update --init --recursive
```
检查完整后，安装cmake环境支持

```
brew install cmake 或者 apt-get install cmake
```
最后安装javascript代码补全

```
./install.py --ts-completer
```
安装完成后，打开vim会闪退，并报一下错误

```
Error detected while processing function <SNR>29_PollServerReady[7]..<SNR>29_Pyeval:Vim: Finished.
```

这好像是Mac更新了系统版本后会出现的错误，具体原因不明，解决方法是重新安装`vim`

```
brew install vim
```
我的MacBook不知道为什么没办法直接用参数覆盖系统的`vim`，所以只能用`alias`指定`vim`命令为新安装的`vim`。

新建`~/.bashrc`

```
vim ~/.bashrc
```
在`~/.bashrc`中用`alias`指定新的`vim`，新`vim`的目录可以通过`brew info vim`命令找到

```
alias vim='/usr/local/Cellar/vim/8.1.0950/bin/vim'
```
新建`~/.bash_profile`，该文件的作用是每次启动终端都会运行里面的指令，这里用于加载`~/.bashrc`，里`alias`生效

```
vim ~/.bash_profile
```
在`~/.bash_profile`中添加

```
source ~/.bashrc
```
至此，`youcompleteme`终于安装完成，尝试用`vim`编辑了一下`JavaScript`代码，发现代码补全功能已经生效了。
#### 拓展
如果需要更好的支持JavaScript代码补全，还需要安装配置`tern_for_vim`
##### 安装
在`.vimrc`中添加

```
Plugin 'marijnh/tern_for_vim'
```
在vim中运行

```
:PluginInstall
```
##### 配置
进入`youcompleteme`目录下，安装`tern_for_vim`支持

```
install.py --tern-complete
```
进入`tern_for_vim`目录下,执行

```
npm install
```
在用户目录下，或者项目目录下新建`.tern-project`，并添加以下配置

```
{
    "ecmaVersion": 6,
    "libs": [
        "browser",
        "underscore",
        "jquery"
    ],
    "plugins": {
        "node": {}
    }
}
```
现在，通过配置`.tern-project`，我们就可以增强对JavaScript的代码补全

最终效果
![预览](https://aoaotheone.cn/markdownImg/youcomplete.png)
