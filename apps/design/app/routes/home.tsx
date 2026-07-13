import { Avatar, AvatarFallback } from '@app/ui/components/avatar'
import { Badge } from '@app/ui/components/badge'
import { Button } from '@app/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/ui/components/card'
import { Input } from '@app/ui/components/input'
import { Label } from '@app/ui/components/label'
import { Bell } from '@app/ui/lib/icons'
import { Separator } from '@app/ui/components/separator'
import { Toaster, toast } from '@app/ui/components/sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/ui/components/tabs'

export function meta() {
  return [
    { title: '@app/ui — boilerplate' },
    { name: 'description', content: 'Boilerplate home page' },
  ]
}

export default function Home() {
  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="flex items-center gap-2">
                @app/ui
                <Badge variant="secondary">connecté</Badge>
              </CardTitle>
              <CardDescription>
                Design system partagé branché sur l&apos;app web
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <Tabs defaultValue="form">
            <TabsList className="w-full">
              <TabsTrigger value="form">Formulaire</TabsTrigger>
              <TabsTrigger value="buttons">Boutons</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="mt-4 flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="dev@boilerplate.io" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" placeholder="Jane Doe" />
              </div>
            </TabsContent>

            <TabsContent value="buttons" className="mt-4 flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
            </TabsContent>
          </Tabs>

          <Separator />

          <Button
            className="w-full"
            onClick={() =>
              toast.success('Toaster opérationnel', {
                description: 'sonner + next-themes fonctionnent.',
              })
            }
          >
            <Bell />
            Déclencher un toast
          </Button>
        </CardContent>
      </Card>

      <Toaster />
    </main>
  )
}
