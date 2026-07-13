import { Link } from 'react-router'
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
import { Separator } from '@app/ui/components/separator'
import { PasswordInput } from '../../components/password-input'

export function meta() {
  return [{ title: 'Connexion — Boilerplate' }]
}

export default function Login() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl">Connexion</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour accéder à votre espace
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.fr"
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                to="/forgot-password"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" className="mt-1 w-full">
            Se connecter
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">ou</span>
          <Separator className="flex-1" />
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link to="/register">Créer un compte</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
