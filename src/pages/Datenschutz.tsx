export default function Datenschutz() {
  return (
    <div className="max-w-3xl mx-auto text-left flex flex-col gap-8 text-sm md:text-base">
      <h1 className="text-2xl mb-8 text-center">DATENSCHUTZERKLÄRUNG</h1>

      {/* 1. Datenschutz auf einen Blick */}
      <div className="flex flex-col gap-4">
        <p className="font-bold normal-case text-lg">1. Datenschutz auf einen Blick</p>
        
        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Allgemeine Hinweise</p>
          <p className="normal-case">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Datenerfassung auf dieser Website</p>
          <p className="normal-case">
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen. Ihre Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Welche Rechte haben Sie bezüglich Ihrer Daten?</p>
          <p className="normal-case">
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese jederzeit für die Zukunft widerrufen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
          </p>
        </div>
      </div>

      {/* 2. Allgemeine Hinweise und Pflichtinformationen */}
      <div className="flex flex-col gap-4">
        <p className="font-bold normal-case text-lg">2. Allgemeine Hinweise und Pflichtinformationen</p>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Hinweis zur verantwortlichen Stelle</p>
          <p className="normal-case">
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
            Hermanns &amp; Rützel GbR<br />
            Restauration19<br />
            Helmstraße 19<br />
            90419 Nürnberg<br /><br />
            Telefon: +49 (0) 911 / 25350782<br />
            E-Mail: <a href="mailto:info@restauration19.de" className="hover:text-brand-pink transition-colors">info@restauration19.de</a>
          </p>
          <p className="normal-case">
            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Speicherdauer</p>
          <p className="normal-case">
            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen).
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Widerruf Ihrer Einwilligung zur Datenverarbeitung</p>
          <p className="normal-case">
            Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Beschwerderecht bei der zuständigen Aufsichtsbehörde</p>
          <p className="normal-case">
            Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">SSL- bzw. TLS-Verschlüsselung</p>
          <p className="normal-case">
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
          </p>
        </div>
      </div>

      {/* 3. Datenerfassung auf dieser Website */}
      <div className="flex flex-col gap-4">
        <p className="font-bold normal-case text-lg">3. Datenerfassung auf dieser Website</p>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Server-Log-Dateien</p>
          <p className="normal-case">
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
          </p>
          <ul className="list-disc list-inside ml-4 normal-case flex flex-col gap-1">
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p className="normal-case">
            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Anfrage per E-Mail oder Telefon</p>
          <p className="normal-case">
            Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.
          </p>
        </div>
      </div>

      {/* 4. Hosting und Backend-Dienste */}
      <div className="flex flex-col gap-4">
        <p className="font-bold normal-case text-lg">4. Hosting und Backend-Dienste</p>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Google Firebase</p>
          <div className="normal-case flex flex-col gap-2">
            <p>
              Wir nutzen zur Bereitstellung unserer Website, unserer Datenbank sowie für den internen Login-Bereich Google Firebase. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland (Mutterunternehmen: Google LLC, USA).
            </p>
            <p>Wir nutzen folgende Firebase-Dienste:</p>
            <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
              <li><strong>Firebase Hosting:</strong> Zur Auslieferung unserer Website-Inhalte. Hierbei werden kurzzeitig IP-Adressen der Nutzer verarbeitet.</li>
              <li><strong>Cloud Firestore:</strong> Als Datenbank für unsere Menüinhalte.</li>
              <li><strong>Firebase Authentication:</strong> Zur Verwaltung von Nutzer-Logins im internen Backend-Bereich. Hierbei werden E-Mail-Adressen und Passwörter sowie IP-Adressen und User-Agent-Strings verarbeitet.</li>
            </ul>
            <p>
              Firebase verschlüsselt Daten bei der Übertragung standardmäßig mittels HTTPS und isoliert Kundendaten logisch. Zudem verschlüsseln Cloud Firestore und Firebase Authentication die Daten auch im Ruhezustand (Data at rest). Firebase beschränkt den internen Zugriff auf personenbezogene Daten auf ausgewählte Mitarbeiter und protokolliert diese Zugriffe.
            </p>
            <p>
              Die Nutzung dieser Dienste erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer sicheren, schnellen und zuverlässigen Darstellung und Verwaltung unserer Website. Die internationale Datenübertragung, insbesondere in die USA, wird durch Standardvertragsklauseln der EU-Kommission (SCCs) abgesichert. Wir haben mit Google einen Vertrag zur Auftragsverarbeitung (AVV) geschlossen.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Google Analytics for Firebase</p>
          <p className="normal-case">
            Soweit Sie eingewilligt haben, nutzen wir auf dieser Website Google Analytics for Firebase zur Auswertung des Nutzerverhaltens. In Analytics werden standardmäßig Daten erhoben, wobei detaillierte Standort- und Gerätedaten deaktiviert werden können. Die IP-Adressen der Nutzer werden anonymisiert verarbeitet. Sie können die Speicherdauer der Nutzerdaten anpassen (z. B. auf 14 Monate). Rechtsgrundlage für diese Verarbeitung ist Ihre ausdrückliche Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Die Einwilligung kann jederzeit widerrufen werden.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Google Gemini API (Künstliche Intelligenz)</p>
          <p className="normal-case">
            Für bestimmte automatisierte Funktionen auf unserer Website / in unserem Backend nutzen wir die Google Gemini API. Bei der Nutzung dieses Dienstes werden API-Eingaben (Prompts) und Ausgaben an Server von Google übertragen. Google speichert diese Daten temporär (in der Regel für bis zu 30 Tage), primär zur Missbrauchserkennung und zur Verbesserung der Dienstqualität. Sofern wir den Dienst über einen kostenpflichtigen Zugang nutzen, werden die übermittelten Daten von Google laut den Nutzungsbedingungen nicht für das Training der KI-Modelle verwendet. Rechtsgrundlage für die Nutzung ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung innovativer KI-gestützter Funktionen).
          </p>
        </div>
      </div>

      {/* 5. Plugins und Tools */}
      <div className="flex flex-col gap-4">
        <p className="font-bold normal-case text-lg">5. Plugins und Tools</p>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Tebi Buchungsservice</p>
          <div className="normal-case flex flex-col gap-2">
            <p>
              Auf unserer Website binden wir den Reservierungsservice der Firma Tebi ein. Anbieter ist die Tebi B.V., Keizersgracht 451, 1017 DK Amsterdam, Niederlande.
            </p>
            <p>
              Wenn Sie eine Tischreservierung über diesen Dienst vornehmen, werden Ihre Daten direkt an Tebi übertragen. Die Datenübertragung erfolgt verschlüsselt. Zu den verarbeiteten Daten können insbesondere Ihre Kontaktdaten (Name, E-Mail-Adresse, Telefonnummer), Reservierungsinformationen (Datum, Uhrzeit, Personenanzahl) sowie freiwillige Angaben gehören.
            </p>
            <p>
              Die Einbindung des Buchungsservices erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und unserem berechtigten Interesse an einer effizienten Tischreservierung (Art. 6 Abs. 1 lit. f DSGVO). Wir haben mit Tebi einen Vertrag über die Auftragsverarbeitung geschlossen.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold normal-case">Lokale Schriftarten</p>
          <p className="normal-case">
            Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten Web Fonts. Diese sind lokal auf unserem Server installiert. Eine Verbindung zu externen Servern (z. B. von Google, Velvetyne oder MyFonts) findet dabei bei Aufruf der Seite nicht statt, wodurch keine IP-Adressen an diese Dienste übertragen werden.
          </p>
        </div>
      </div>

    </div>
  );
}