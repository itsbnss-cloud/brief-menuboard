// ============================================================
//  Jeune Designer Studio — Brief Menu Board v2
//  google-apps-script.gs
// ============================================================

const SHEET_ID          = 'COLLE_LIDENTIFIANT_DE_TON_GOOGLE_SHEET';
const SHEET_NAME        = 'Briefs';
const EMAIL_DESTINATAIRE = 'TON_EMAIL@gmail.com';

const COLUMNS = [
  'Date','Nom établissement','Type de resto','Support','Nb supports',
  'Logo','Charte','Couleurs','Menu (texte)','Nb catégories',
  'Ambiance','Priorité','Références','Couleurs board',
  'Infos à afficher','Délai','Budget','Remarques',
];

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      data.date || '', data.nom || '', data.type || '', data.support || '',
      data.nb || '', data.logo || '', data.charte || '', data.couleurs || '',
      data.menu_txt || '', data.nb_cat || '', data.ambiance || '', data.priorite || '',
      data.ref || '', data.couleurs_board || '', data.extras || '',
      data.delai || '', data.budget || '', data.notes || '',
    ]);

    sendEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmail(data) {
  const sujet = `🎨 Nouveau brief — ${data.nom || 'Client'} (${data.type || ''})`;

  const row = (lbl, val) => val
    ? `<tr><td style="padding:6px 0;color:#888;font-size:12px;width:160px">${lbl}</td>
       <td style="padding:6px 0;color:#222;font-size:12px;font-weight:500">${val}</td></tr>`
    : '';

  const sec = (title, rows) => `
    <div style="margin-bottom:20px">
      <div style="font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;
        color:#F5A623;border-bottom:1px solid #eee;padding-bottom:6px;margin-bottom:10px">${title}</div>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
    </div>`;

  const html = `
  <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
    <div style="background:#F5A623;padding:24px 28px">
      <h1 style="color:#000;margin:0;font-size:20px">Nouveau Brief Menu Board</h1>
      <p style="color:#333;margin:4px 0 0;font-size:13px">${data.date || ''} · ${data.nom || ''}</p>
    </div>
    <div style="padding:24px 28px">
      ${sec('01 — Établissement',
        row('Nom', data.nom) + row('Type', data.type) +
        row('Support', data.support) + row('Nb supports', data.nb))}
      ${sec('02 — Identité visuelle',
        row('Logo', data.logo) + row('Charte', data.charte) + row('Couleurs', data.couleurs))}
      ${sec('03 — Menu',
        row('Nb catégories', data.nb_cat) + row('Détail menu', data.menu_txt))}
      ${sec('04 — Direction artistique',
        row('Ambiance', data.ambiance) + row('Priorité', data.priorite) +
        row('Références', data.ref) + row('Couleurs board', data.couleurs_board))}
      ${sec('05 — Détails',
        row('Infos affichées', data.extras) + row('Délai', data.delai) +
        row('Budget', data.budget) + row('Remarques', data.notes))}
    </div>
    <div style="background:#1a1a1a;padding:14px 28px;text-align:center;font-size:11px;color:#888">
      <span style="color:#F5A623;font-weight:bold">Jeune Designer Studio</span>
      &nbsp;·&nbsp; Brief généré automatiquement
    </div>
  </div></div>`;

  MailApp.sendEmail({
    to:       EMAIL_DESTINATAIRE,
    subject:  sujet,
    htmlBody: html,
    name:     'Jeune Designer Studio',
  });
}

function doGet() {
  return ContentService
    .createTextOutput('✅ Script actif — Jeune Designer Studio')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    const h = sheet.getRange(1, 1, 1, COLUMNS.length);
    h.setBackground('#F5A623');
    h.setFontColor('#000');
    h.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}
