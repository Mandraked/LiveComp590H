#pragma strict

public var shootClip : AudioClip;
public var hurtClip : AudioClip;
public var deathClip : AudioClip;
public var discoveryClip : AudioClip;

private var shootAudio : AudioSource;
private var hurtAudio : AudioSource;
private var deathAudio : AudioSource;
private var discoveryAudio : AudioSource;

function Awake() {
    shootAudio = gameObject.AddComponent(AudioSource);
    shootAudio.clip = shootClip;
    shootAudio.loop = false;
    shootAudio.playOnAwake = false;
    shootAudio.volume = 0.8;
    shootAudio.dopplerLevel = 0.0;

    hurtAudio = gameObject.AddComponent(AudioSource);
    hurtAudio.clip = hurtClip;
    hurtAudio.loop = false;
    hurtAudio.playOnAwake = false;
    hurtAudio.volume = 0.8;
    hurtAudio.dopplerLevel = 0.0;

    deathAudio = gameObject.AddComponent(AudioSource);
    deathAudio.clip = deathClip;
    deathAudio.loop = false;
    deathAudio.playOnAwake = false;
    deathAudio.volume = 0.8;
    deathAudio.dopplerLevel = 0.0;

    discoveryAudio = gameObject.AddComponent(AudioSource);
    discoveryAudio.clip = discoveryClip;
    discoveryAudio.loop = false;
    discoveryAudio.playOnAwake = false;
    discoveryAudio.volume = 0.8;
    discoveryAudio.dopplerLevel = 0.0;
}

function Update() {

}

function PlayShoot() {
    shootAudio.Play();
}

function PlayHurt() {
    hurtAudio.Play();
}

function PlayDeath() {
    deathAudio.Play();
}

function PlayDiscovery() {
    discoveryAudio.Play();
}
