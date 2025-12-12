// Data processing worker
export const processData = async (data: unknown[]): Promise<unknown[]> => {
  return new Promise((resolve) => {
    // Simulate heavy data processing
    setTimeout(() => {
      const processedData = data.map(item => ({
        ...(item as Record<string, unknown>),
        processed: true,
        timestamp: new Date().toISOString()
      }));
      resolve(processedData);
    }, 100);
  });
};

export const filterData = (data: unknown[], filters: Record<string, unknown>): unknown[] => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      return (item as Record<string, unknown>)[key] === value;
    });
  });
};

export const sortData = (data: unknown[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): unknown[] => {
  return [...data].sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[sortBy];
    const bValue = (b as Record<string, unknown>)[sortBy];
    
    if (String(aValue) < String(bValue)) return sortOrder === 'asc' ? -1 : 1;
    if (String(aValue) > String(bValue)) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}; 