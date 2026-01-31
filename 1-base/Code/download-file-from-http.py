#!/usr/bin/env python3
"""
HTTP 文件下载工具
支持进度显示、断点续传、超时设置等功能
"""

import argparse
import sys
from pathlib import Path

import requests

# ==================== 配置区域 ====================
# 在此处修改下载配置
DEFAULT_SERVER_URL = "http://172.18.10.1:8000"  # 服务器基础地址
DEFAULT_FILE_PATH = "picker_test.tar.gz"  # 服务器上的文件名（本地保存名称与此一致）
DEFAULT_TIMEOUT = 30  # 请求超时时间（秒）
# =================================================


def download_file(url, output_path=None, timeout=30, chunk_size=8192, resume=True):
    """
    从 HTTP 服务器下载文件

    Args:
        url: 下载文件的 URL
        output_path: 保存路径（默认为 URL 中的文件名）
        timeout: 请求超时时间（秒）
        chunk_size: 下载块大小（字节）
        resume: 是否支持断点续传
    """
    try:
        # 确定输出文件路径
        if output_path is None:
            output_path = Path(url).name
        else:
            output_path = Path(output_path)

        # 检查是否支持断点续传
        file_size = 0
        if resume and output_path.exists():
            file_size = output_path.stat().st_size
            headers = {"Range": f"bytes={file_size}-"}
            print(
                f"检测到已存在文件，尝试断点续传（已下载 {format_size(file_size)}）..."
            )
        else:
            headers = {}
            print(f"开始下载: {url}")

        # 发送请求
        response = requests.get(url, headers=headers, stream=True, timeout=timeout)
        response.raise_for_status()

        # 获取文件总大小
        total_size = int(response.headers.get("content-length", 0))
        if resume and file_size > 0:
            total_size += file_size

        # 保存文件
        mode = "ab" if resume and file_size > 0 else "wb"
        downloaded_size = file_size

        with open(output_path, mode) as f:
            for chunk in response.iter_content(chunk_size=chunk_size):
                if chunk:
                    f.write(chunk)
                    downloaded_size += len(chunk)

                    # 显示进度
                    if total_size > 0:
                        progress = downloaded_size / total_size * 100
                        print(
                            f"\r进度: {progress:.1f}% ({format_size(downloaded_size)}/{format_size(total_size)})",
                            end="",
                        )
                    else:
                        print(f"\r已下载: {format_size(downloaded_size)}", end="")

        print(f"\n✓ 下载完成: {output_path} (大小: {format_size(downloaded_size)})")
        return True

    except requests.exceptions.Timeout:
        print(f"\n✗ 请求超时（{timeout}秒）")
        return False
    except requests.exceptions.ConnectionError:
        print("\n✗ 连接失败，请检查网络和服务器地址")
        return False
    except requests.exceptions.HTTPError as e:
        print(f"\n✗ HTTP 错误: {e}")
        return False
    except KeyboardInterrupt:
        print("\n⚠ 下载已取消")
        return False
    except Exception as e:
        print(f"\n✗ 下载失败: {e}")
        return False


def format_size(size_bytes):
    """格式化文件大小显示"""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def main():
    parser = argparse.ArgumentParser(description="HTTP 文件下载工具")
    parser.add_argument("url", help="下载文件的 URL")
    parser.add_argument("-o", "--output", help="保存文件路径（默认为 URL 中的文件名）")
    parser.add_argument(
        "-t", "--timeout", type=int, default=30, help="请求超时时间（秒，默认30）"
    )
    parser.add_argument("--no-resume", action="store_true", help="禁用断点续传")

    args = parser.parse_args()

    download_file(
        url=args.url,
        output_path=args.output,
        timeout=args.timeout,
        resume=not args.no_resume,
    )


if __name__ == "__main__":
    # 如果直接运行脚本且没有参数，使用默认配置
    if len(sys.argv) == 1:
        default_url = f"{DEFAULT_SERVER_URL}/{DEFAULT_FILE_PATH}"
        print(f"使用默认配置下载: {default_url}")
        print(f"服务器地址: {DEFAULT_SERVER_URL}")
        print(f"文件名: {DEFAULT_FILE_PATH}")
        download_file(
            default_url, output_path=DEFAULT_FILE_PATH, timeout=DEFAULT_TIMEOUT
        )
    else:
        main()
