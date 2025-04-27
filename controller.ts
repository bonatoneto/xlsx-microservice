import axios from 'axios';
import { Request, Response } from 'express';
import * as XLSX from 'xlsx';

const EMAIL_API_URL = "http://localhost:5001/disparar-email";

interface EmailData {
  campanha: string;
  email: string;
  mensagem: string;
  status: 'enviado' | 'pendente';
}

class GenerateArchiveController {
  public handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await axios.post(`${EMAIL_API_URL}`);
      const data = response.data as EmailData[];
  
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Planilha');
  
      const xlsxBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx'});
      const fileName = `planilha_${new Date().toISOString().replace(/[:]/g, '-')}.xlsx`;
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileName}`
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheet.sheet'
      );
      res.setHeader('Content-Length', xlsxBuffer.length);

      res.end(xlsxBuffer);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao realizar a requisição' });
    }
  }
}

export { GenerateArchiveController }