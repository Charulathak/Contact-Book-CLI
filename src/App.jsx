import { useState, useMemo } from 'react'
import { Plus, Search, Trash2, Pencil, X, Check, User, Mail, Phone } from 'lucide-react'

import './App.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const INITIALS = [];
function getInitials(name){
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

function App() {
  const [contacts, setContacts] = useState(INITIALS)
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('view')
  const [draft, setDraft] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? contacts.filter((c) => c.name.toLowerCase().includes(q)) : contacts;
    return [...list].sort((a,b) => a.name.localeCompare(b.name))
  },[contacts, query]);
  const grouped = useMemo(() =>{
    const g = {}
    filtered.forEach((c) =>{
      const letter = c.name[0]?.toUpperCase() || "#";
      g[letter] = g[letter] || [];
      g[letter].push(c);
    })
    return g;
  }, [filtered])

  const availableLetters = new Set(Object.keys(grouped))
  const selected = contacts.find((c) => c.id === selectedId)

  function startCreate(){
    setDraft({id: null, name: "", phone: "", email: "", notes: ""});
    setMode("create");
  }

  function startEdit(){
    setDraft({...selected});
    setMode("edit");
  }

  function cancelForm(){
    setDraft(null);
    setMode("view");
  }

  function saveForm(){
    if(!draft.name.trim()) return;
    if(mode === 'create'){
      const newContact = {...draft, id: Date.now()};
      setContacts((prev) => [...prev, newContact]);
      setSelectedId(newContact.id);
    }else{
      setContacts((prev) => prev.map((c) => (c.id === draft.id) ? {...draft} : c))
    }
    setDraft(null);
    setMode("view")
  }

  function deleteContact(id){
    const remaining = contacts.filter((c) => c.id !== id);
    setContacts(remaining);
    setSelectedId(remaining[0]?.id ?? null);
    setConfirmDelete(false);
    setMode("view");
  }

  const cardShown = mode !== 'view' ? draft : selected;

  return (
    <>
      <div className="contact-book">
        <div className="sidebar">
          {ALPHABET.map((L) => {
            const active = availableLetters.has(L)
            return (
              <span key={L} className={`letter ${active ? 'active' : ''}`} onClick={() => {
                if (!active) return
                const first = grouped[L][0]
                setSelectedId(first.id)
                setMode("view")
              }}>{L}</span>
            )
          })}
        </div>
        {/* Contact list */}
        <div className="contact-list-main-wrapper">
          <div style={{ padding: "14px 14px 10px" }}>
            <div className="contact-list-main">Contact Book</div>
            <div className="contact-list-filter">
                <Search size={16} color="#8a7c58" />
                <input value={query} onChange={(e) =>setQuery(e.target.value)} className="contact-list-filter-input" placeholder="Search Contacts" />
            </div>
          </div>

          <div className="contact-list-view">
              {Object.keys(grouped).sort().map((letter) => (
                <div key={letter} style={{ marginBottom: "6px"}}>
                  <div className="contact-list-letter">{letter}</div>
                  {grouped[letter].map((c) => (
                    <div key={c.id} onClick={() =>{
                      setSelectedId(c.id);
                      setMode("view");
                      setConfirmDelete(false);
                    }} className={`contact-list-item-wrapper ${c.id === selectedId ? 'active' : ''}`}>
                      <div className="contact-list-item">
                        {getInitials(c.name)}
                      </div>
                      <span style={{fontSize: "13.5px"}}>{c.name}</span>
                    </div>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="contact-list-empty">No contacts found.</div>
              )}
          </div>

          <div className="contact-add-wrapper">
              <button className="contact-add-button" onClick={startCreate}>
                <Plus size={14} /> New Contact
              </button>
          </div>
        </div>

        {/* Detail/edit pannel */}
        <div className="contact-detail-wrapper">
          {!cardShown ? (
            <div className="card-no-detail">Select a contact, or add a new one.</div>
          ) :(
            <div className="contact-detail-card">
              <div className="contact-detail-card-header" />
                  <div style={{padding: "22px 26px 26px"}}>
                    {mode === 'view' ? (
                      <>
                       <div className="contact-detail-card-content">
                          <div className="contact-detail-info">
                            {getInitials(selected.name)}
                          </div>
                          <div className="contact-detail-buttons">
                            <IconBtn onClick={startEdit} title="Edit"><Pencil size={14} /></IconBtn>
                            <IconBtn onClick={() => setConfirmDelete(true)} title="Delete"><Trash2 size={14} /></IconBtn>
                          </div>
                       </div>

                       <div className="contact-detail-card-main">{selected.name}</div>
                       
                       <DetailRow icon={<Phone size={14} />} label="Phone" value={selected.phone || "-"} />
                       <DetailRow icon={<Mail size={14} />} label="Email" value={selected.email || "-"} />
                        {selected.notes && (
                          <div className="contact-detail-card-notes">
                            <div className="contact-detail-card-notes-label">Notes</div>
                            <div className="contact-detail-card-notes-content">{selected.notes}</div>
                          </div>
                        )}

                        {confirmDelete && (
                          <div className="contact-detail-card-delete-confirm">
                            <div className="contact-detail-card-delete-confirm-text">Are you sure you want to delete this contact?</div>
                            <div className="contact-detail-card-delete-confirm-buttons">
                              <button onClick={() => deleteContact(selected.id)} className="contact-detail-card-delete-confirm-button btn-danger">Yes</button>
                              <button onClick={() => setConfirmDelete(false)} className="contact-detail-card-delete-confirm-button btn-ghost">No</button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="card-create-contact">
                          {mode === 'create' ? "Create New Contact" : "Edit Contact"}
                        </div>
                        <Field icon={<User size={14} />} label ="Name" value={draft.name} onChange={(v) =>setDraft({...draft, name: v})} autoFocus/>
                        <Field icon={<Phone size={14} />} label="Phone" value={draft.phone} onChange={(v) => setDraft({...draft, phone: v})} />
                        <Field icon={<Mail size={14} />} label="Email" value={draft.email} onChange={(v) => setDraft({...draft, email:v })} />
                        <div style={{ marginBottom: "14px"}}>
                          <div className="field-name">Notes</div>
                          <textarea value={draft.notes} onChange={(e) =>setDraft({...draft, notes: e.target.value})} rows={3} className="form-control"/>
                        </div>
                        <div className="contact-detail-card-edit-buttons">
                          <button onClick={saveForm} disabled={!draft.name.trim()} className="contact-detail-card-edit-button btn-primary"><Check size={14} /> Save</button>
                          <button onClick={cancelForm} className="contact-detail-card-edit-button btn-ghost"><X size={14} /> Cancel</button>
                        </div>
                      </>
                    )}
                  </div>
              </div>
          )}
        </div>
      </div>
    </>
  )
}

function DetailRow({ icon, label, value}){
  return (
    <div className="detail-row-info">
      <span style={{ color: "#9c8c5f" }}>{icon}</span>
      <span>{value}</span>
    </div>
  )
}

function Field({ icon, label, value, onChange, autoFocus}){
  return (
    <div style={{ marginBottom: "12px"}}>
        <div className="form-label">{label}</div>
        <div className="col-group">
          <span style={{color: "#9c8c5f"}}>{icon}</span>
          <input autoFocus={autoFocus} value={value} onChange={(e) => onChange(e.target.value)} className="form-input"/>
        </div>
    </div>
  )
}

function IconBtn({ children, onClick, title}){
  return (
    <button onClick={onClick} title={title} className="icon-btn">{children}</button>
  )
}

export default App
