export const generateCode = (length: number): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}

