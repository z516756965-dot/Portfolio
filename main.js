/* ================= 3. 全局页面交互行为脚本 (main.js) ================= */

// 开启右上角悬浮联系业务框弹窗

window.openContactPopup = function() {
    document.getElementById('contactPopup').classList.add('active');
    document.getElementById('contactPopupOverlay').classList.add('active');
};

window.closeContactPopup = function() {
    document.getElementById('contactPopup').classList.remove('active');
    document.getElementById('contactPopupOverlay').classList.remove('active');
};

// 跨端极速文本剪切板复制分流适配机制
window.copyText = function(text, element) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => { showCopiedFeedback(element, text); });
    } else {
        let textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); showCopiedFeedback(element, text); } catch (err) {}
        document.body.removeChild(textArea);
    }
};

function showCopiedFeedback(element, originalText) {
    const span = element.querySelector('span');
    span.innerText = '已复制！';
    element.style.pointerEvents = 'none'; 
    setTimeout(() => { span.innerText = originalText; element.style.pointerEvents = 'auto'; }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section-block');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');

    function updateSubNavActive(containerSelector, blockSelector, navSelector, triggerRatio = 0.42) {
        const container = document.querySelector(containerSelector);
        const subNav = document.querySelector(navSelector);
        if (!container || !subNav) return;

        const blocks = Array.from(container.querySelectorAll(blockSelector)).filter(block => {
            return block.offsetParent !== null && block.getAttribute('id');
        });
        if (!blocks.length) return;

        const triggerLine = window.innerHeight * triggerRatio;
        const containerRect = container.getBoundingClientRect();
        let currentId = blocks[0].getAttribute('id');

        blocks.forEach(block => {
            if (block.getBoundingClientRect().top <= triggerLine) {
                currentId = block.getAttribute('id');
            }
        });

        if (containerRect.bottom <= triggerLine) {
            currentId = blocks[blocks.length - 1].getAttribute('id');
        }

        const visibleIds = new Set(blocks.map(block => block.getAttribute('id')));
        subNav.querySelectorAll('a').forEach(link => {
            const targetId = link.getAttribute('href').replace('#', '');
            const hasVisibleTarget = visibleIds.has(targetId);
            link.hidden = !hasVisibleTarget;
            link.classList.toggle('active', hasVisibleTarget && targetId === currentId);
        });
    }

    function updateScrollSpy() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) { current = section.getAttribute('id'); }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) { link.classList.add('active'); }
        });

        updateSubNavActive('#aigc-projects-section', '.stage-detail-block', '#aigc-sub-nav', 0.42);
        updateSubNavActive('#visual-design-section', '.vd-sub-section', '#vd-sub-nav', 0.42);
        updateSubNavActive('#ai-management-section', '.stage-detail-block', '#aimgmt-sub-nav', 0.42);
    }

    // 页面滚动多级联动状态监听 (Scroll Spy 监听)
    window.addEventListener('scroll', updateScrollSpy);
    window.addEventListener('resize', updateScrollSpy);
    updateScrollSpy();

    // 初始化外部高并发 Swiper 轮播面板
    const swiper = new Swiper('.coze-carousel', {
        slidesPerView: 1,  
        spaceBetween: 20,          
        loop: true,                
        speed: 800,                
        autoplay: { 
            delay: 4000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
        },
        pagination: { el: '.coze-pagination', clickable: true },
        navigation: { nextEl: '.coze-next', prevEl: '.coze-prev' }
    });

    const vebeSwiper = new Swiper('.vebe-carousel', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 800,
        pagination: { el: '.vebe-pagination', clickable: true },
        navigation: { nextEl: '.vebe-next', prevEl: '.vebe-prev' }
    });
    
    const videoSwiper = new Swiper('.video-carousel', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false, // 包含视频的轮播建议关闭 loop，防止播放状态错乱
    speed: 600,
    pagination: { el: '.video-pagination', clickable: true },
    navigation: { nextEl: '.video-next', prevEl: '.video-prev' }
    });
    // 前端业务大模型自动化工作流多 Tabs 节点切换
    const fwTabs = document.querySelectorAll('.fw-tab');
    const fwContents = document.querySelectorAll('.fw-content');

    fwTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            fwTabs.forEach(t => t.classList.remove('active'));
            fwContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
});
