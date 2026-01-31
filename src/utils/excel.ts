import * as XLSX from 'xlsx'

/**
 * 从 Excel 文件中读取第一列（姓名）和第二列（部门）
 * 返回格式：如果有部门则为 "姓名（部门）"，否则只返回姓名
 */
export async function parseExcelFirstColumn(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // 转换为 JSON 数组
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][]
        
        // 提取第一列（姓名）和第二列（部门）
        const names: string[] = []
        for (const row of jsonData) {
          if (!row || !row[0]) continue
          
          // 获取姓名
          let name = ''
          if (typeof row[0] === 'string' && row[0].trim()) {
            name = row[0].trim()
          } else if (typeof row[0] === 'number') {
            name = String(row[0])
          }
          
          if (!name) continue
          
          // 获取部门（如果有）
          let department = ''
          if (row[1]) {
            if (typeof row[1] === 'string' && row[1].trim()) {
              department = row[1].trim()
            } else if (typeof row[1] === 'number') {
              department = String(row[1])
            }
          }
          
          // 组合显示：如果有部门则显示 "姓名（部门）"
          if (department) {
            names.push(`${name}（${department}）`)
          } else {
            names.push(name)
          }
        }
        
        resolve(names)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}
