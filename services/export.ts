/**
 * Utility for exporting text and mocking audio export.
 */

export function exportText(text: string, filename: string = 'readit-export.txt') {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportMockAudio(text: string, filename: string = 'readit-audio.mp3') {
  // Real Web Speech API doesn't allow easy audio stream capture across all browsers.
  // We mock the audio download by creating a fake blob to satisfy the prototype requirement.
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const fakeAudioContent = `Fake audio for: ${text.substring(0, 50)}...`;
  const blob = new Blob([fakeAudioContent], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function nativeShare(text: string, title: string = 'ReadIt Scan') {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
      });
      return true;
    } catch (err) {
      console.error("Share failed:", err);
      return false;
    }
  }
  return false;
}
