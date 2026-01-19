const KEY = "fakehunters:image:history:v1";

export function loadImageHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveImageHistory(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function pushImageHistory(entry) {
  const list = loadImageHistory();

  // 동일 jobUuid면 최신으로 갱신
  const filtered = list.filter((x) => x.jobUuid !== entry.jobUuid);

  const next = [entry, ...filtered].slice(0, 50); // 최대 50개
  saveImageHistory(next);
  return next;
}

export function removeImageHistory(jobUuid) {
  const list = loadImageHistory().filter((x) => x.jobUuid !== jobUuid);
  saveImageHistory(list);
  return list;
}

export function clearImageHistory() {
  saveImageHistory([]);
  return [];
}
