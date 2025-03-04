export const handleError = (error) => {
  console.error('حدث خطأ:', error);
  // يمكنك إضافة منطق إضافي لمعالجة الأخطاء هنا
};

export const validateBoard = (board) => {
  if (!board || !board.lists) {
    throw new Error('تنسيق اللوحة غير صالح');
  }
  return true;
}; 