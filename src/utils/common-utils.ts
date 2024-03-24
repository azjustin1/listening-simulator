export class CommonUtils {
  static generateRandomId() {
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    const machineId = Math.floor(Math.random() * 16777216).toString(16);
    const counter = Math.floor(Math.random() * 16777216).toString(16);

    return timestamp + machineId + counter;
  }

  static base64ToFile(base64Image: string, fileName: string) {
    const base64Data = base64Image.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      '',
    );
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'image/png' });
    return new File([blob], fileName, { type: 'image/png' });
  }
}
