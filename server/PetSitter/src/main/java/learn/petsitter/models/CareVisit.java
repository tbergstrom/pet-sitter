package learn.petsitter.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

public class CareVisit {
    private int careVisitId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDateTime timeOfDay;
    private String notes;
    private BigDecimal cost;
    private int ownerId;
    private int sitterId;


    public CareVisit() {}

    public CareVisit(int careVisitId, LocalDate start_date, LocalDate end_date, String status, LocalDateTime timeOfDay, String notes, BigDecimal cost, int owner_id, int sitter_id) {
        this.careVisitId = careVisitId;
        this.startDate = start_date;
        this.endDate = end_date;
        this.status = status;
        this.timeOfDay = timeOfDay;
        this.notes = notes;
        this.cost = cost;
        this.ownerId = owner_id;
        this.sitterId = sitter_id;
    }

    public int getCareVisitId() {
        return careVisitId;
    }

    public void setCareVisitId(int careVisitId) {
        this.careVisitId = careVisitId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimeOfDay() {
        return timeOfDay;
    }

    public void setTimeOfDay(LocalDateTime timeOfDay) {
        this.timeOfDay = timeOfDay;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public int getSitter_id() {
        return sitterId;
    }

    public void setSitter_id(int sitter_id) {
        this.sitterId = sitter_id;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CareVisit that = (CareVisit) o;
        return careVisitId == that.careVisitId && Objects.equals(startDate, that.startDate) && Objects.equals(endDate, that.endDate) && Objects.equals(status, that.status) && Objects.equals(timeOfDay, that.timeOfDay) && Objects.equals(notes, that.notes) && Objects.equals(cost, that.cost) && ownerId == that.ownerId && sitterId == that.sitterId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(careVisitId, startDate, endDate, status, timeOfDay, notes, cost, ownerId, sitterId);
    }

}
