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
import { ArrowLeft } from '@app/ui/lib/icons'

export function meta() {
  return [{ title: 'Mot de passe oublié — UIX' }]
}

export default function ForgotPassword() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl">Mot de passe oublié</CardTitle>
        <CardDescription>
          Entrez votre e-mail et nous vous enverrons un lien de réinitialisation
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

          <Button type="submit" className="mt-1 w-full">
            Envoyer le lien
          </Button>
        </form>

        <Button variant="ghost" size="sm" className="w-full gap-2" asChild>
          <Link to="/login">
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
