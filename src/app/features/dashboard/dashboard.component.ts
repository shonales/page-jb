import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

type GreetingPeriod = 'morning' | 'afternoon' | 'night' | 'lateNight';

interface DashboardGreeting {
  title: string;
  message: string;
  periodLabel: string;
}

const GREETING_MESSAGES: Record<GreetingPeriod, string[]> = {
  morning: [
    'Que hoy te vaya bonito y que todo salga mejor de lo esperado.',
    'Empieza el dia con calma, con ganas y con una sonrisa bonita.',
    'Hoy tambien es una buena oportunidad para crear otro recuerdo especial.',
  ],
  afternoon: [
    'Espero que tu tarde vaya tranquila y que encuentres un momento para respirar.',
    'Que lo que queda del dia venga suave, bonito y sin tanto cansancio.',
    'Una pausa pequena tambien cuenta; esta pagina te espera con recuerdos bonitos.',
  ],
  night: [
    'Que tu noche sea tranquila, bonita y con algo que te haga sonreir.',
    'Ya casi termina el dia; ojala haya tenido algo lindo para guardar aqui.',
    'Esta noche tambien puede ser un buen momento para mirar recuerdos juntos.',
  ],
  lateNight: [
    'Descansa temprano, ya es muy noche. Manana seguimos creando recuerdos bonitos.',
    'Ya paso de las diez; cuida tus ojitos y duerme con calma.',
    'Es tarde, asi que entra un ratito y luego a descansar bonito.',
  ],
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  readonly currentUser = this.auth.currentUser;
  readonly greeting = this.buildGreeting();

  readonly actions = [
    {
      title: 'Albun de fotos',
      path: '/albun',
      cover: 'dashboard-covers/albun.jpeg',
      accent: 'teal',
    },
    {
      title: 'Linea de tiempo',
      path: '/timeline',
      cover: 'dashboard-covers/line-time.jpeg',
      accent: 'gold',
    },
    {
      title: 'Capsula',
      path: '/capsula',
      cover: '',
      accent: 'rose',
    },
  ];

  private buildGreeting(): DashboardGreeting {
    const user = this.currentUser() ?? 'JB';
    const period = this.getGreetingPeriod(new Date().getHours());
    const titleByPeriod: Record<GreetingPeriod, string> = {
      morning: `Buenos dias ${user}`,
      afternoon: `Buenas tardes ${user}`,
      night: `Buenas noches ${user}`,
      lateNight: `Buenas noches ${user}`,
    };

    return {
      title: titleByPeriod[period],
      message: this.pickRandom(GREETING_MESSAGES[period]),
      periodLabel: this.getPeriodLabel(period),
    };
  }

  private getGreetingPeriod(hour: number): GreetingPeriod {
    if (hour >= 5 && hour < 12) {
      return 'morning';
    }

    if (hour >= 12 && hour < 19) {
      return 'afternoon';
    }

    if (hour >= 19 && hour < 22) {
      return 'night';
    }

    return 'lateNight';
  }

  private getPeriodLabel(period: GreetingPeriod): string {
    const labels: Record<GreetingPeriod, string> = {
      morning: '05:00 - 11:59',
      afternoon: '12:00 - 18:59',
      night: '19:00 - 21:59',
      lateNight: '22:00 - 04:59',
    };

    return labels[period];
  }

  private pickRandom(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
  }
}
