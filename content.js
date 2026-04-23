function injectStatsButtons() {
    // 1. 寻找放置按钮的容器（Last hour 所在的 TD）
    const lastHourInput = document.querySelector('input[name="range"][value="3600|60"]');
    if (!lastHourInput) return;
    
    const container = lastHourInput.parentElement.parentElement; // 获取 TD 容器
    if (!container || container.dataset.expanded) return;

    // 2. 定义需要增加的配置
    const extraOptions = [
        { id: 'radio-8h', value: '28800|600', text: 'Last eight hours' },
        { id: 'radio-24h', value: '86400|1800', text: 'Last day' }
    ];

    extraOptions.forEach(opt => {
        // 创建 label
        const label = document.createElement('label');
        label.className = 'radio';
        label.setAttribute('for', opt.id);
        //label.style.marginLeft = "10px"; // 加点间距美化

        // 创建 input
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = opt.id;
        input.name = 'range';
        input.value = opt.value;

        // 组装
        label.appendChild(input);
        label.appendChild(document.createTextNode(opt.text));
        container.appendChild(label);
        
        // 监听点击事件，确保触发 RabbitMQ 原生逻辑
        input.addEventListener('change', () => {
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });

    // 3. 标记容器已处理，避免重复插入
    container.dataset.expanded = "true";
    console.log("RabbitMQ Stats: 8H and 24H options injected.");
}

// 使用 MutationObserver 监听动态生成的详情面板
const observer = new MutationObserver((mutations) => {
    injectStatsButtons();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// 初始化运行
injectStatsButtons();