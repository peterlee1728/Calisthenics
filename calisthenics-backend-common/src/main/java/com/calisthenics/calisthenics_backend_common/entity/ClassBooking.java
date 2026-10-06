package com.calisthenics.calisthenics_backend_common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "[CLASS_BOOKING]", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CLASS_BOOKING_ID")
    private Integer classBookingId;

    @Enumerated(EnumType.STRING)
    @Column(name = "BOOKING_STATUS", length = 20)
    @Builder.Default
    private BookingStatus bookingStatus = BookingStatus.Pending;

    @Column(name = "BOOKING_DATE")
    private LocalDateTime bookingDate;

    // Many-to-one: USER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    // Many-to-one: CLASSES
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CLASS_ID", nullable = false)
    private CalisthenicsClass calisthenicsClass;

    // Enum — matches DB check: Pending, Confirmed, Cancelled, Completed
    public enum BookingStatus {
        Pending, Confirmed, Cancelled, Completed
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        if (bookingDate == null) {
            bookingDate = LocalDateTime.now();
        }
        if (bookingStatus == null) {
            bookingStatus = BookingStatus.Pending;
        }
    }
}
