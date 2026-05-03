#!/bin/bash

# ==============================================================================
# Script to sync my-products component across all projects in the directory
# ==============================================================================

# Source directory (current project's component)
SOURCE_DIR="/Users/meetqy/Desktop/meetqy/meetqy-template/src/components/my-products"
# Root directory to search for other projects
SEARCH_ROOT="/Users/meetqy/Desktop/meetqy"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory $SOURCE_DIR not found!"
    exit 1
fi

echo "🚀 Starting synchronization of 'my-products' component..."
echo "📂 Source: $SOURCE_DIR"
echo "🔍 Searching in: $SEARCH_ROOT"
echo "--------------------------------------------------"

# Find all directories named 'my-products' under the search root, excluding the source itself
# Also exclude node_modules to speed up search and avoid false positives
find "$SEARCH_ROOT" -type d -name "my-products" -not -path "*/node_modules/*" | while read -r target_dir; do
    # Skip the source directory
    if [[ "$target_dir" == "$SOURCE_DIR"* ]]; then
        continue
    fi

    echo "--------------------------------------------------"
    echo "📦 更新项目目录: $target_dir"
    
    # 1. 同步文件
    cp "$SOURCE_DIR/index.tsx" "$target_dir/"
    cp "$SOURCE_DIR/index.css" "$target_dir/"
    cp "$SOURCE_DIR/utils.ts" "$target_dir/"
    echo "✅ 文件同步完成"

    # 2. 查找项目根目录并检查依赖
    project_root="$target_dir"
    while [[ "$project_root" != "$SEARCH_ROOT" && ! -f "$project_root/package.json" ]]; do
        project_root=$(dirname "$project_root")
    done

    if [ -f "$project_root/package.json" ]; then
        echo "🏠 项目根目录: $project_root"
        
        # 检查是否安装了 marked
        if ! grep -q "\"marked\":" "$project_root/package.json"; then
            echo "📥 正在安装 marked 依赖..."
            (cd "$project_root" && pnpm add marked)
            echo "✅ marked 安装完成"
        else
            echo "✅ marked 已经安装"
        fi

        # 3. Git 提交并推送
        if [ -d "$project_root/.git" ]; then
            echo "🌿 检测到 Git 仓库，正在提交更改..."
            (cd "$project_root" && \
             git add . && \
             git commit -m "chore: sync my-products component and update readme format" && \
             git push)
            echo "🚀 Git 提交并推送完成"
        else
            echo "⚠️ 未检测到 Git 仓库，跳过提交"
        fi
    else
        echo "⚠️ 未找到 package.json，跳过依赖检查和 Git 操作"
    fi
done

echo "--------------------------------------------------"
echo "✨ 所有项目同步处理完成！"
