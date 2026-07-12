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
import { PasswordInput } from '../../components/password-input'

export function meta() {
  return [{ title: 'Créer un compte — Boilerplate' }]
}

export default function Register() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl">Créer un compte</CardTitle>
        <CardDescription>Rejoignez-nous en quelques secondes</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              placeholder="Jean Dupont"
              autoComplete="name"
              required
            />
          </div>

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
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              id="password"
              placeholder="8 caractères minimum"
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" className="mt-1 w-full">
            Créer mon compte
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
