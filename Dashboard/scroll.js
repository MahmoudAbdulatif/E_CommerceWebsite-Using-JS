document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
  
    // الزر مرئي دائمًا
    scrollToTopBtn.style.display = 'block';
  
    // التمرير إلى أعلى عند النقر
    scrollToTopBtn.addEventListener('click', () => {
      window.location.href = '../seller_product/seller_products.html'; });
    });
  });