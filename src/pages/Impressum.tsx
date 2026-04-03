export default function Impressum() {
  return (
    <div className="max-w-3xl mx-auto text-left flex flex-col gap-8 text-sm md:text-base">
      <h1 className="text-2xl mb-8 text-center">IMPRESSUM</h1>

      <div className="flex flex-col gap-2 normal-case">
        <p>
          Hermanns &amp; Rützel GbR<br/>
          Restauration19<br/>
          Helmstraße 19<br/>
          90419 Nürnberg
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">KONTAKT</p>
        <p className="normal-case">
          Telefon: 0911 25350782<br/>
          E-Mail: <a href="mailto:info@restauration19.de" className="hover:text-brand-pink transition-colors">info@restauration19.de</a>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">VERTRETUNGSBERECHTIGTE GESELLSCHAFTER</p>
        <p className="normal-case">Florian Hermanns, Krispin Rützel</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">UMSATZSTEUER-IDENTIFIKATIONSNUMMER GEMÄSS §27 A UMSATZSTEUERGESETZ</p>
        <p className="normal-case">DE 461 020 856</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">ZUSTÄNDIGE AUFSICHTSBEHÖRDE</p>
        <p className="normal-case">
          Ordnungsamt Nürnberg<br/>
          Innerer Laufer Platz 3<br/>
          90403 Nürnberg
        </p>
        <a href="https://www.nuernberg.de/internet/ordnungsamt/gaststaetten.html" target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink transition-colors break-all normal-case">
          https://www.nuernberg.de/internet/ordnungsamt/gaststaetten.html
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">VERBRAUCHERSTREITBEILEGUNG/­UNIVERSALSCHLICHTUNGSSTELLE</p>
        <p className="normal-case">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">EU-STREITSCHLICHTUNG</p>
        <p className="normal-case">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink transition-colors break-all">
            https://ec.europa.eu/consumers/odr
          </a>.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">QUELLENANGABEN FÜR DIE VERWENDETEN BILDER</p>
        <p className="normal-case">Quirin Staufer</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">HAFTUNG FÜR INHALTE</p>
        <div className="normal-case flex flex-col gap-2">
          <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
          <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">HAFTUNG FÜR LINKS</p>
        <div className="normal-case flex flex-col gap-2">
          <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
          <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">URHEBERRECHT</p>
        <div className="normal-case flex flex-col gap-2">
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
          <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
        </div>
        <p className="text-gray-400 text-xs mt-2 normal-case">Quellenhinweis: www.e-recht24.de</p>
      </div>
    </div>
  );
}