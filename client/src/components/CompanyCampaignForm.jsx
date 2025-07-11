import React, { useState } from "react";
import "./CompanyCampaignForm.css";

const CompanyCampaignForm = () => {
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [bgColor, setBgColor] = useState("#F2F2F2");
  const [boardColor, setBoardColor] = useState("#D96D87");

  const [conceptNote, setConceptNote] = useState("");
  const [importantDates, setImportantDates] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [dateNote, setDateNote] = useState("");

  const [storyInputs, setStoryInputs] = useState([
    { subStory: "", category: "" },
    { subStory: "", category: "" },
    { subStory: "", category: "" },
  ]);

  const [contentTypes, setContentTypes] = useState([
    { title: "Collection Video with Models", image: null },
    { title: "Product Carousel", image: null },
    { title: "Product Video", image: null },
    { title: "Collection with Model", image: null },
    { title: "GIF", image: null },
    { title: "Lay Down Look", image: null },
  ]);

  const [storyImage, setStoryImage] = useState(null);
  const [storyHeadline, setStoryHeadline] = useState("");
  const [storyDescription, setStoryDescription] = useState("");

  const [page9Content1, setPage9Content1] = useState([null, null, null]);
  const [page9Content2, setPage9Content2] = useState(null);
  const [page9Content3, setPage9Content3] = useState([null, null]);

  const [page10Content4, setPage10Content4] = useState(null);
  const [page10Content5, setPage10Content5] = useState([null, null]);

  const [page11StoryImage, setPage11StoryImage] = useState(null);
  const [page11StoryHeadline, setPage11StoryHeadline] = useState("");
  const [page11StoryDescription, setPage11StoryDescription] = useState("");
  const [page13Content1, setPage13Content1] = useState([null, null]);
const [page13Content2, setPage13Content2] = useState(null);
const [page13Content3, setPage13Content3] = useState([null, null, null]);
const [page14Content1, setPage14Content1] = useState(null);
const [page14Content2, setPage14Content2] = useState([null, null]);
const [page14Content3, setPage14Content3] = useState(null);
const [page15StoryHeadline, setPage15StoryHeadline] = useState("");
const [page15StoryImage, setPage15StoryImage] = useState(null);
const [page15StoryDescription, setPage15StoryDescription] = useState("");
const [page17Content1, setPage17Content1] = useState([null, null, null]);
const [page17Content2, setPage17Content2] = useState(null);
const [page17Content3, setPage17Content3] = useState([null, null, null]);
const [page18Content1, setPage18Content1] = useState(null);      // For 1 image
const [page18Content2, setPage18Content2] = useState([null, null]); // For 2 images
const [page18Content3, setPage18Content3] = useState(null);      // For 1 image

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleAddDateNote = () => {
    if (!selectedDate || !dateNote.trim()) return;
    setImportantDates((prev) => ({
      ...prev,
      [selectedDate]: dateNote.trim(),
    }));
    setSelectedDate("");
    setDateNote("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();

  // Page 1
  formData.append("coverTitle", title);
  formData.append("slogan", slogan);
  formData.append("image", imageFile);
  formData.append("backgroundColor", bgColor);
  formData.append("boardColor", boardColor);

  // Page 2
  formData.append("conceptNoteText", conceptNote);

  // Page 3
  formData.append("importantDates", JSON.stringify(importantDates));

  // Page 4
  formData.append("storyBreakup", JSON.stringify(storyInputs));

  // Page 5
  contentTypes.forEach((ct) => {
    if (ct.image) formData.append("contentImages", ct.image);
  });

  // Page 6
  if (storyImage) formData.append("storyImage", storyImage);
  formData.append("storyHeadline", storyHeadline);
  formData.append("storyDescription", storyDescription);

  // Page 9
  page9Content1.forEach((img) => {
    if (img) formData.append("page9Content1", img);
  });
  if (page9Content2) formData.append("page9Content2", page9Content2);
  page9Content3.forEach((img) => {
    if (img) formData.append("page9Content3", img);
  });

  // Page 10
  if (page10Content4) formData.append("page10Content4", page10Content4);
  page10Content5.forEach((img) => {
    if (img) formData.append("page10Content5", img);
  });

  // Page 11
  if (page11StoryImage) formData.append("page11StoryImage", page11StoryImage);
  formData.append("page11StoryHeadline", page11StoryHeadline);
  formData.append("page11StoryDescription", page11StoryDescription);

  // ✅ Page 13
  page13Content1.forEach((img) => {
    if (img) formData.append("page13Content1", img);
  });
  if (page13Content2) formData.append("page13Content2", page13Content2);
  page13Content3.forEach((img) => {
    if (img) formData.append("page13Content3", img);
  });
// Page 14
if (page14Content1) formData.append("page14Content1", page14Content1);
page14Content2.forEach((img) => {
  if (img) formData.append("page14Content2", img);
});
if (page14Content3) formData.append("page14Content3", page14Content3);

// Page 15
formData.append("page15StoryHeadline", page15StoryHeadline);
if (page15StoryImage) formData.append("page15StoryImage", page15StoryImage);
formData.append("page15StoryDescription", page15StoryDescription);
// Page 17
page17Content1.forEach((img) => {
  if (img) formData.append("page17Content1", img);
});
if (page17Content2) formData.append("page17Content2", page17Content2);
page17Content3.forEach((img) => {
  if (img) formData.append("page17Content3", img);
});

// Page 18
if (page18Content1) formData.append("page18Content1", page18Content1);
page18Content2.forEach((img) => {
  if (img) formData.append("page18Content2", img);
});
if (page18Content3) formData.append("page18Content3", page18Content3);


  try {
    setLoading(true);
    setPreviewUrl("");

    const res = await fetch("http://localhost:5000/api/generate-cover?preview=true", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("PDF generation failed");

    const data = await res.json();
    const blob = new Blob(
      [Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0))],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  } catch (err) {
    console.error("❌ PDF Error:", err);
    alert("Something went wrong while generating the preview.");
  } finally {
    setLoading(false);
  }
};


  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `CoverPage_${title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form className="campaign-form" onSubmit={handleSubmit}>
      <h2>🎯 Step {step} of 14</h2>

      {/* Form UI remains unchanged — your current JSX for steps 1–8 goes here */}
      {step === 1 && (
        <><h3>Enter Cover Page Details </h3>
          <label>📘 Cover Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>📝 Slogan</label>
          <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} required />

          <label>🖼️ Upload Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />

          <label>🎨 Background Color</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />

          <label>🟥 Board Color</label>
          <input type="color" value={boardColor} onChange={(e) => setBoardColor(e.target.value)} />
        </>
      )}

      {step === 2 && (
        <><h3>Concept Note For 2nd Page</h3>
          <label>🧾 Concept Note</label>
          <textarea rows="6" value={conceptNote} onChange={(e) => setConceptNote(e.target.value)} required />
        </>
      )}

      {step === 3 && (
        <><h3>Key Dates of the Month</h3>
          <label>📅 Mark Calendar Dates</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <input type="text" placeholder="Add note" value={dateNote} onChange={(e) => setDateNote(e.target.value)} />
            <button type="button" onClick={handleAddDateNote}>➕ Add</button>
          </div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.entries(importantDates).map(([date, note]) => (
              <li key={date}>📌 <b>{date}:</b> {note}</li>
            ))}
          </ul>
        </>
      )}

      {step === 4 && (
        <>
          <label>📚 Story Breakups</label>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th></th>
                <th>Sub Stories</th>
                <th>Product Categories</th>
              </tr>
            </thead>
            <tbody>
              {storyInputs.map((story, i) => (
                <tr key={i}>
                  <td><b>{`Story ${i + 1}`}</b></td>
                  <td>
                    <input
                      type="text"
                      value={story.subStory}
                      onChange={(e) => {
                        const updated = [...storyInputs];
                        updated[i].subStory = e.target.value;
                        setStoryInputs(updated);
                      }}
                      placeholder="Enter sub story"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={story.category}
                      onChange={(e) => {
                        const updated = [...storyInputs];
                        updated[i].category = e.target.value;
                        setStoryInputs(updated);
                      }}
                      placeholder="Enter product category"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {step === 5 && (
        <>
          <label>🖼️ Upload Content Type Images</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "10px" }}>
            {contentTypes.map((ct, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <div style={{
                  border: "2px dashed #ccc",
                  padding: "10px",
                  borderRadius: "8px",
                  height: "180px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  backgroundColor: "#f9f9f9",
                }}>
                  {ct.image ? (
                    <img
                      src={URL.createObjectURL(ct.image)}
                      alt={ct.title}
                      style={{ maxWidth: "100%", maxHeight: "160px", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "12px" }}>No image uploaded</span>
                  )}
                </div>
                <p style={{ fontWeight: "bold", marginTop: "8px", fontSize: "13px" }}>{ct.title}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const updated = [...contentTypes];
                    updated[index].image = e.target.files[0];
                    setContentTypes(updated);
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 6 && (
        <>
        <h3>Story 1</h3>
          <label>📸 Upload Story Visual</label>
          <input type="file" accept="image/*" onChange={(e) => setStoryImage(e.target.files[0])} required />

          <label>🗣️ Story Headline</label>
          <input type="text" value={storyHeadline} onChange={(e) => setStoryHeadline(e.target.value)} required />

          <label>📝 Story Description</label>
          <textarea rows="4" value={storyDescription} onChange={(e) => setStoryDescription(e.target.value)} required />
        </>
      )}

      {step === 7 && (
        <>
          <h3>🖼️ As Per Grid Look Content Upload For Story 1</h3>

          <label>📷Content -1 LAY DOIWN LOOK</label>
          {page9Content1.map((img, i) => (
            <input key={i} type="file" accept="image/*" onChange={(e) => {
              const updated = [...page9Content1];
              updated[i] = e.target.files[0];
              setPage9Content1(updated);
            }} />
          ))}

          <label>📷 Content 2 – Gif(but here enter image)</label>
          <input type="file" accept="image/*" onChange={(e) => setPage9Content2(e.target.files[0])} />

          <label>📷 Content 3 –  COLLECTION STILL WITH MODEL</label>
          {page9Content3.map((img, i) => (
            <input key={i} type="file" accept="image/*" onChange={(e) => {
              const updated = [...page9Content3];
              updated[i] = e.target.files[0];
              setPage9Content3(updated);
            }} />
          ))}
        </>
      )}


      {step === 8 && (
        <>
          <h3>Story 1 next Contents </h3>

          <label>📹 Content 4 – Product Video Reference (Upload Image)</label>
          <input type="file" accept="image/*" onChange={(e) => setPage10Content4(e.target.files[0])} />

          <label>📷 Content 5 – Product Carousel (Upload 2 Images)</label>
          {page10Content5.map((img, i) => (
            <input key={i} type="file" accept="image/*" onChange={(e) => {
              const updated = [...page10Content5];
              updated[i] = e.target.files[0];
              setPage10Content5(updated);
            }} />
          ))}

          <label>🎥 Content 6 – Collection Video with Model</label>
          <p>Reference given in the link — feel the awesome model video.</p>
        </>
      )}

      {step === 9 && (
        <>
          <h3> Story 2</h3>

          <label>📌 Story Title (Fixed Left Label)</label>
          <input
            type="text"
            value="STORY 2"
            disabled
            style={{ backgroundColor: "#eee", fontWeight: "bold" }}
          />

          <label>🗣️ Story Headline</label>
          <input
            type="text"
            value={page11StoryHeadline}
            onChange={(e) => setPage11StoryHeadline(e.target.value)}
            required
          />

          <label>📸 Upload Story Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPage11StoryImage(e.target.files[0])}
            required
          />

          <label>📝 Story Description</label>
          <textarea
            rows="4"
            value={page11StoryDescription}
            onChange={(e) => setPage11StoryDescription(e.target.value)}
            required
          />
        </>
      )}{step === 10 && (
  <>
    <h3>As Per Grid Look Content Upload For Story 2</h3>
   

    <label>🖼️ Content 1 – LAY DOIWN LOOK</label>
    {page13Content1.map((img, i) => (
      <input
        key={i}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const updated = [...page13Content1];
          updated[i] = e.target.files[0];
          setPage13Content1(updated);
        }}
      />
    ))}

    <label>🖼️ Content 2 –  GIF</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPage13Content2(e.target.files[0])}
    />

    <label>🖼️ Content 3 –  COLLECTION STILL WITH MODEL</label>
    {page13Content3.map((img, i) => (
      <input
        key={i}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const updated = [...page13Content3];
          updated[i] = e.target.files[0];
          setPage13Content3(updated);
        }}
      />
    ))}
  </>
)}
{step === 11 && (
  <>
    <h3>📄 Page 14 – Video Content with Blocks</h3>
   

    <label> Content - 4 PRODUCT VIDEO</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPage14Content1(e.target.files[0])}
    />

    <label>Contnet -5 PRODUCT CAROUSEL</label>
    {page14Content2.map((img, i) => (
      <input
        key={i}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const updated = [...page14Content2];
          updated[i] = e.target.files[0];
          setPage14Content2(updated);
        }}
      />
    ))}

    <label>🖼️ Content 6  COLLECTION VIDEO WITH MODEL</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPage14Content3(e.target.files[0])}
    />
  </>
)}
{step === 12 && (
  <>
    <h3>Story 3</h3>

    <label>📌 Story Title </label>
    <input
      type="text"
      value="STORY 3"
      disabled
      style={{ backgroundColor: "#eee", fontWeight: "bold" }}
    />

    <label>🗣️ Story Headline</label>
    <input
      type="text"
      value={page15StoryHeadline}
      onChange={(e) => setPage15StoryHeadline(e.target.value)}
      required
    />

    <label>📸 Upload Story Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPage15StoryImage(e.target.files[0])}
      required
    />

    <label>📝 Story Description</label>
    <textarea
      rows="4"
      value={page15StoryDescription}
      onChange={(e) => setPage15StoryDescription(e.target.value)}
      required
    />
  </>
)}{step === 13 && (
  <>
    <h3>As Per Grid Look Content Upload For Story 2</h3>
    

    <label>📷 Content 1 – LAY DOIWN LOOK</label>
    {page17Content1.map((img, i) => (
      <input
        key={i}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const updated = [...page17Content1];
          updated[i] = e.target.files[0];
          setPage17Content1(updated);
        }}
      />
    ))}

    <label>📷 Content 2 –  GIF </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPage17Content2(e.target.files[0])}
    />

    <label>📷 Content 3 –  COLLECTION STILL WITH MODEL</label>
    {page17Content3.map((img, i) => (
      <input
        key={i}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const updated = [...page17Content3];
          updated[i] = e.target.files[0];
          setPage17Content3(updated);
        }}
      />
    ))}
  </>
)}
{step === 14 && (
  <>
    <h3>🖼️ Next Part of Story 3</h3>
   
    <label>📽️ Conent -4 PRODUCT VIDEO</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPage18Content1(e.target.files[0])}
    />

    <label>🖼️ Content -5  PRODUCT CAROUSEL</label>
    {page18Content2.map((img, i) => (
      <input
        key={i}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const updated = [...page18Content2];
          updated[i] = e.target.files[0];
          setPage18Content2(updated);
        }}
      />
    ))}

    <label>🖼️Content - 6  PRODUCT CAROUSEL</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPage18Content3(e.target.files[0])}
    />
  </>
)}





      {/* Navigation and Preview Buttons */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        {step > 1 && <button type="button" onClick={() => setStep(step - 1)}>⬅️ Back</button>}
        {step < 14 && <button type="button" onClick={() => setStep(step + 1)}>➡️ Next</button>}
        {step === 14 && (
          <button type="submit" disabled={loading}>
            {loading ? "⏳ Creating..." : "🚀 Generate Preview"}
          </button>
        )}
      </div>

      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>📄 Preview</h3>
          <iframe src={previewUrl} width="100%" height="600px" style={{ border: "1px solid #ccc" }} title="Preview" />
          <button onClick={handleDownload} type="button" style={{ marginTop: "10px" }}>
            ⬇️ Download PDF
          </button>
        </div>
      )}
    </form>
  );
};

export default CompanyCampaignForm;
