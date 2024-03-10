export function filterSortAndPaginateTasks(tasks, titleFilter, completedFilter, pageInputValue, limitInputValue, sortBy, sortOrder) {

  const page = parseInt(pageInputValue, 10);
  const limit = parseInt(limitInputValue, 10);

  const filteredTasks = titleFilter
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(titleFilter.toLowerCase())
      )
    : tasks;

  const filteredByCompleted = completedFilter !== null
    ? filteredTasks.filter(task => task.completed === completedFilter)
    : filteredTasks;

  const sortedTasks = filteredByCompleted.sort((a, b) => {
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
    return sortOrderValue * (a[sortBy] - b[sortBy]);
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTasks = sortedTasks.slice(startIndex, endIndex);

  return paginatedTasks;
}
