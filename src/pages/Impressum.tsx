export default function Impressum() {
  return (
    <div className="max-w-3xl mx-auto text-left flex flex-col gap-8 text-sm md:text-base">
      <h1 className="text-2xl mb-8 text-center">IMPRESSUM</h1>

      <div className="flex flex-col gap-2">
        <p>HERMANNS &amp; RÜTZEL GBR</p>
        <p>
          HELMSTRASSE 19<br/>
          RESTAURATION19<br/>
          90419 NÜRNBERG
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-brand-green">KONTAKT</p>
        <p>
          TELEFON: 0911 25350782<br/>
          E-MAIL: <a href="mailto:info@restauration19.de" className="hover:text-brand-pink transition-colors">INFO@RESTAURATION19.DE</a>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-brand-green">VERTRETUNGSBERECHTIGTER GESELLSCHAFTER</p>
        <p>
          FLORIAN HERMANNS<br/>
          KRISPIN MARTIN RÜTZEL
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-brand-green">UMSATZSTEUER-IDENTIFIKATIONSNUMMER</p>
        <p>UMSATZSTEUER-IDENTIFIKATIONSNUMMER GEMÄSS § 27A USTG: DE461020856</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-brand-green">ZUSTÄNDIGE AUFSICHTSBEHÖRDE</p>
        <p>
          ORDNUNGSAMT NÜRNBERG<br/>
          INNERER LAUFER PLATZ 3<br/>
          90403 NÜRNBERG
        </p>
        <a href="https://www.nuernberg.de/internet/ordnungsamt/gaststaetten.html" target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink transition-colors break-all">
          WWW.NUERNBERG.DE/INTERNET/ORDNUNGSAMT/GASTSTAETTEN.HTML
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-brand-green">VERBRAUCHERSTREITBEILEGUNG</p>
        <p>WIR SIND NICHT BEREIT UND NICHT VERPFLICHTET, AN EINEM STREITBEILEGUNGSVERFAHREN VOR EINER VERBRAUCHERSCHLICHTUNGSSTELLE TEILZUNEHMEN.</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-brand-green">SOCIAL MEDIA</p>
        <a href="https://www.instagram.com/restauration19_nbg" target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink transition-colors">
          INSTAGRAM: @RESTAURATION19_NBG
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-brand-green">BILDNACHWEISE</p>
        <p>QUIRIN STAUFER</p>
      </div>
    </div>
  );
}
