import { useState } from 'react'
import { Bell, CheckCheck } from '@app/ui/lib/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@app/ui/components/avatar'
import { Button } from '@app/ui/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@app/ui/components/popover'
import { ScrollArea } from '@app/ui/components/scroll-area'
import { Separator } from '@app/ui/components/separator'
import { cn } from '@app/ui/lib/utils'

type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  avatar?: { src?: string; fallback: string }
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New team member',
    description: 'Alice joined the Design Engineering project.',
    time: '2 min ago',
    read: false,
    avatar: { fallback: 'AL' },
  },
  {
    id: '2',
    title: 'Deployment successful',
    description: 'Production build #142 deployed without errors.',
    time: '18 min ago',
    read: false,
    avatar: { fallback: 'CI' },
  },
  {
    id: '3',
    title: 'Comment on your PR',
    description: 'Bob left a review on "feat: add sidebar layout".',
    time: '1 h ago',
    read: false,
    avatar: { fallback: 'BO' },
  },
  {
    id: '4',
    title: 'Invoice paid',
    description: 'Acme Corp. paid invoice #2024-089 — €1 200.',
    time: '3 h ago',
    read: true,
    avatar: { fallback: 'AC' },
  },
  {
    id: '5',
    title: 'Storage warning',
    description: 'Your workspace is at 85 % of storage capacity.',
    time: 'Yesterday',
    read: true,
    avatar: { fallback: 'SY' },
  },
]

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-auto gap-1.5 px-2 py-1 text-xs"
              onClick={markAllRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <Separator />

        <ScrollArea className="h-[340px]">
          {notifications.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12 text-sm">
              <Bell className="h-8 w-8 opacity-30" />
              <span>No notifications</span>
            </div>
          ) : (
            <ul>
              {notifications.map((notification, index) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    className={cn(
                      'hover:bg-muted/50 flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                      !notification.read && 'bg-muted/30',
                    )}
                    onClick={() => markRead(notification.id)}
                  >
                    <div className="relative mt-0.5 shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.avatar?.src} />
                        <AvatarFallback className="text-xs">
                          {notification.avatar?.fallback}
                        </AvatarFallback>
                      </Avatar>
                      {!notification.read && (
                        <span className="bg-primary ring-background absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                      <span className="truncate text-sm leading-none font-medium">
                        {notification.title}
                      </span>
                      <span className="text-muted-foreground line-clamp-2 text-xs">
                        {notification.description}
                      </span>
                      <span className="text-muted-foreground/70 mt-1 text-xs">
                        {notification.time}
                      </span>
                    </div>
                  </button>
                  {index < notifications.length - 1 && (
                    <Separator className="mx-4 w-auto" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>

        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground w-full text-xs"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
