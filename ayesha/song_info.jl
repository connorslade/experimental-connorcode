using FFMPEG
using JSON
using ImageIO
using Images
using FileIO

BASE_FOLDER::String = "V:\\Music\\Ayesha Erotica\\Music\\"
OUT_PATH::String = "songs.json"

struct Audio
    path::String
    title::String
    track::Int64
    genre::Union{String,Nothing}
    year::Union{Int64,Nothing}
    duration::Float64
    bitrate::Int64
end

mutable struct Album
    tracks::Vector{Audio}
    year::Int64
    album_cover::String
end

function probe_file(path::String)
    raw = FFMPEG.exe("-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", path, command=FFMPEG.ffprobe, collect=true)
    json = JSON.parse(join(raw, "\n"))
    return json
end

function get_or(json::Dict{String,Any}, key::String, get::Function, default::Function)
    if haskey(json, key)
        return get(json[key])
    end

    return default()
end

function is_whitespace(str::String)::Bool
    for c in str
        if !isspace(c)
            return false
        end
    end

    return true
end

function count(dict::Dict{String,Album})
    c = 0
    for i in values(dict)
        c += length(i.tracks)
    end

    return c
end

songs = Dict{String,Album}()

for (root, dirs, files) in walkdir(BASE_FOLDER)
    old_count = count(songs)

    last_cover = ""
    last_cover_size = 0

    print("Processing $root ")
    for file in files
        if !endswith(file, ".jpg") && !endswith(file, ".png")
            continue
        end

        path = joinpath(root, file)
        image = size(load(path))
        image_size = image[1] * image[2]

        if image_size > last_cover_size
            last_cover_size = image_size
            last_cover = replace(path[length(BASE_FOLDER):end], "\\" => "/")
        end
    end

    for file in files
        if !endswith(file, ".mp3") && !endswith(file, ".m4a")
            continue
        end

        path = joinpath(root, file)

        try
            info = probe_file(path)
            path = replace(path[length(BASE_FOLDER):end], "\\" => "/")
            name = get_or(info["format"]["tags"], "title", x -> x, () -> splitext(basename(path))[1])
            album = info["format"]["tags"]["album"]
            track = parse(Int64, info["format"]["tags"]["track"])
            genre = get_or(info["format"]["tags"], "genre", x -> x, () -> nothing)
            year = get_or(info["format"]["tags"], "date", x -> is_whitespace(x) ? nothing : parse(Int64, x), () -> nothing)
            duration = parse(Float64, info["format"]["duration"])
            bitrate = parse(Int64, info["format"]["bit_rate"])

            if !haskey(songs, album)
                songs[album] = Album([], 0, last_cover)
            end

            push!(songs[album].tracks, Audio(path, name, track, genre, year, duration, bitrate))
            if year !== nothing
                songs[album].year = max(year, songs[album].year)
            end
        catch e
            println("Error loading $path\n$e")
            continue
        end
    end


    println("($(count(songs) - old_count))")
end

println("Total songs: $(count(songs))")

out = open(OUT_PATH, "w")
JSON.print(out, songs)
close(out)