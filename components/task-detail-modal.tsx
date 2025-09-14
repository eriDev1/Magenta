'use client';

import { Task, TaskStatus, TaskPriority, O, pipe } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  User, 
  Clock, 
  MessageSquare, 
  Paperclip, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { getPriorityColor, getStatusColor } from '@/lib/common/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

const mockComments = [
  {
    id: '1',
    author: 'John Doe',
    avatar: null,
    content: 'I\'ve started working on this task. The initial research is complete.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    author: 'Alice Smith',
    avatar: null,
    content: 'Great progress! I\'ve reviewed the requirements and they look good. Let me know if you need any help with the implementation.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

const mockActivity = [
  {
    id: '1',
    type: 'status_change',
    author: 'John Doe',
    content: 'changed status from To Do to In Progress',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'comment',
    author: 'Alice Smith',
    content: 'added a comment',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

export function TaskDetailModal({ task, isOpen, onClose, onUpdate }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  const isOverdue = pipe(
    task.dueDate,
    O.map(date => date < new Date() && task.status !== 'completed'),
    O.getOrElse(() => false)
  );

  const handleEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(task.id, {
        title: editedTitle,
        description: editedDescription,
      });
    }
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onUpdate) {
      onUpdate(task.id, { status: newStatus });
    }
  };

  const handlePriorityChange = (newPriority: TaskPriority) => {
    if (onUpdate) {
      onUpdate(task.id, { priority: newPriority });
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-6 pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  {isEditing ? (
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-lg font-semibold border-none p-0 focus:ring-0 focus:border-none"
                    />
                  ) : (
                    <DialogTitle className="text-lg font-semibold text-gray-900 leading-7">
                      {task.title}
                    </DialogTitle>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        OVERDUE
                      </Badge>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in new tab
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                {isEditing ? (
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Add a description..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {task.description || (
                      <span className="text-gray-400 italic">No description provided</span>
                    )}
                  </div>
                )}
                
                {isEditing && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleSave}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Activity</h3>
                <div className="space-y-4">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-gray-100">
                          {activity.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{activity.author}</span>
                          <span className="text-gray-600 ml-1">{activity.content}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatRelativeTime(activity.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Comments ({mockComments.length})
                </h3>
                
                {/* Add Comment */}
                <div className="flex gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button size="sm" disabled={!newComment.trim()}>
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comment List */}
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm bg-gray-100">
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Done</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                <Select value={task.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Assignee</label>
                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-white">
                  {pipe(
                    task.assigneeId,
                    O.fold(
                      () => (
                        <>
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Unassigned</span>
                        </>
                      ),
                      () => (
                        <>
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                              JD
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">John Doe</span>
                        </>
                      )
                    )
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Due Date</label>
                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-white">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {pipe(
                    task.dueDate,
                    O.fold(
                      () => <span className="text-sm text-gray-500">No due date</span>,
                      date => (
                        <span className={cn(
                          "text-sm",
                          isOverdue ? "text-red-600 font-medium" : "text-gray-900"
                        )}>
                          {date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      )
                    )
                  )}
                </div>
              </div>

              {/* Created/Updated */}
              <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Created {task.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Updated {task.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
