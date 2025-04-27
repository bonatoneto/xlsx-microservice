import axios from 'axios';
import * as XLSX from 'xlsx';

const EMAIL_API_URL = "http://localhost:5001/disparar-email";

class GenerateArchiveController {
  async handle (req, res) {
    try {
      const response = await axios.post(`${EMAIL_API_URL}`);
      const data = response.data;
  
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Planilha');
  
      const xlsxBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx'});
      const fileName = `planilha_${new Date().toISOString().replace(/[:]/g, '-')}.xlsx`;
      res.setHeader('Content-Disposition', `attachment; filename="planilha_${new Date().toISOString().replace(/[:]/g, '-')}.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet');
      res.setHeader('Content-Length', xlsxBuffer.length);

      return res.end(xlsxBuffer);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao realizar a requisição' });
    }
  }
}

export { GenerateArchiveController }