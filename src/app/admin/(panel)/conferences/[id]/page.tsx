import { notFound } from "next/navigation";
import { getConferenceById } from "@/lib/db";
import { CONFERENCE_ROLES, type Conference } from "@/lib/types";
import { AdminHeader, Field, Section } from "@/components/admin/ui";
import { FileField, LangTabs, SaveBar } from "@/components/admin/FormControls";
import { saveConference } from "../../../actions";

export const metadata = { title: "Conférence" };

const ROLES_EN = ["Keynote speaker", "Speaker", "Panellist", "Moderator", "Session chair"];

export default async function EditConference({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "nouveau";
  const found = isNew ? undefined : await getConferenceById(id);
  if (!isNew && !found) notFound();
  const c: Conference = found ?? {
    id: "", title: "", event: "", location: "", date: new Date().toISOString().slice(0, 10), role: "Conférencier",
    description: "", link: "", slidesUrl: "", image: "", i18n: {},
  };
  const en = c.i18n?.en ?? {};

  return (
    <form action={saveConference}>
      <input type="hidden" name="id" value={c.id} />
      <AdminHeader title={isNew ? "Nouvelle conférence" : "Modifier la conférence"} description={isNew ? undefined : c.title} back={{ href: "/admin/conferences", label: "Conférences" }} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Section title="Quand et où">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date" htmlFor="date" required>
                <input id="date" name="date" type="date" required defaultValue={c.date} className="field" />
              </Field>
              <Field label="Lien vers le programme" htmlFor="link">
                <input id="link" name="link" type="url" defaultValue={c.link} className="field" placeholder="https://" />
              </Field>
            </div>
          </Section>
          <Section title="Intervention">
            <LangTabs
              enFilled={!!en.title?.trim()}
              fr={
                <>
                  <Field label="Titre de l'intervention" htmlFor="title" required>
                    <input id="title" name="title" required defaultValue={c.title} className="field" />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Événement" htmlFor="event" required>
                      <input id="event" name="event" required defaultValue={c.event} className="field" />
                    </Field>
                    <Field label="Lieu" htmlFor="location" required>
                      <input id="location" name="location" required defaultValue={c.location} className="field" placeholder="Ville, pays" />
                    </Field>
                  </div>
                  <Field label="Rôle" htmlFor="role">
                    <input id="role" name="role" list="roles" defaultValue={c.role} className="field" />
                    <datalist id="roles">{CONFERENCE_ROLES.map((r) => <option key={r} value={r} />)}</datalist>
                  </Field>
                  <Field label="Description" htmlFor="description">
                    <textarea id="description" name="description" rows={4} defaultValue={c.description} className="field" />
                  </Field>
                </>
              }
              en={
                <>
                  <Field label="Talk title" htmlFor="en_title">
                    <input id="en_title" name="en_title" defaultValue={en.title} className="field" />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Event" htmlFor="en_event">
                      <input id="en_event" name="en_event" defaultValue={en.event} className="field" />
                    </Field>
                    <Field label="Location" htmlFor="en_location">
                      <input id="en_location" name="en_location" defaultValue={en.location} className="field" />
                    </Field>
                  </div>
                  <Field label="Role" htmlFor="en_role">
                    <input id="en_role" name="en_role" list="roles-en" defaultValue={en.role} className="field" />
                    <datalist id="roles-en">{ROLES_EN.map((r) => <option key={r} value={r} />)}</datalist>
                  </Field>
                  <Field label="Description" htmlFor="en_description">
                    <textarea id="en_description" name="en_description" rows={4} defaultValue={en.description} className="field" />
                  </Field>
                </>
              }
            />
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Médias">
            <FileField label="Photo de l'événement" fileName="imageFile" urlName="image" removeName="removeImage" current={c.image} accept="image/*" image hint="Paysage recommandé" />
            <FileField label="Support de présentation" fileName="slidesFile" urlName="slidesUrl" removeName="removeSlides" current={c.slidesUrl} accept=".pdf,.pptx" hint="PDF ou PowerPoint, 15 Mo max." />
          </Section>
        </div>
      </div>

      <SaveBar cancelHref="/admin/conferences" label={isNew ? "Ajouter" : "Enregistrer"} />
    </form>
  );
}
