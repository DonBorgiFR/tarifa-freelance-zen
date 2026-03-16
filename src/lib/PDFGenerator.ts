import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    console.log('Generating PDF for:', elementId);
    const canvas = await (html2canvas as any)(element, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff',
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/png', 0.8);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(`${filename}.pdf`);
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
