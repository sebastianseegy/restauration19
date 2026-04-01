export default function Impressum() {
  return (
    <div className="max-w-3xl mx-auto text-left flex flex-col gap-6 text-sm md:text-base">
      <h1 className="text-2xl mb-8 text-center">IMPRESSUM</h1>
      <p>ANGABEN GEMÄSS § 5 TMG</p>
      <p>
        Hermanns&amp;Rützel GbR<br/>
        Helmstraße 19<br/>
        90419 Nürnberg
      </p>
      <p>
        VERTRETEN DURCH:<br/>
        Florian Hermanns, Krispin Rützel
      </p>
      <p>
        KONTAKT:<br/>
        Telefon: 0049 911<br/>
        E-Mail: <a href="mailto:info@restauration19.de" className="hover:text-brand-pink transition-colors">info@restauration19.de</a>
      </p>
      <p>
        AUFSICHTSBEHÖRDE:<br/>
        Nürnberg
      </p>
      <p>
        STEUERNUMMER GEMÄSS § 21 UMSATZSTEUERGESETZ:<br/>
        238/162/50161
      </p>
    </div>
  );
}
