import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskListItem } from './TaskListItem';

export const SortableTaskListItem = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TaskListItem ref={setNodeRef} {...props} style={style} {...attributes} {...listeners}>
      {props.id}
    </TaskListItem>
  );
};
