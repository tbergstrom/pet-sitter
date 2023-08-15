package learn.petsitter.models;

import java.util.Objects;

public class Pet {
    private int petId;
    private String name;
    private String notes;
    private boolean goesWalking;
    private int ownerId;

    public Pet() {}

    public Pet(int petId, String name, String notes, boolean goesWalking, int ownerId) {
        this.petId = petId;
        this.name = name;
        this.notes = notes;
        this.goesWalking = goesWalking;
        this.ownerId = ownerId;
    }

    public int getPetId() {
        return petId;
    }

    public void setPetId(int petId) {
        this.petId = petId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isGoesWalking() {
        return goesWalking;
    }

    public void setGoesWalking(boolean goesWalking) {
        this.goesWalking = goesWalking;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pet that = (Pet) o;
        return petId == that.petId && Objects.equals(name, that.name) && Objects.equals(notes, that.notes) && goesWalking == goesWalking && ownerId == that.ownerId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(petId, name, notes, goesWalking, ownerId);
    }


}
